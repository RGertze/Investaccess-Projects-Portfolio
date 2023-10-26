using System.Text.Json;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRWebpack.Hubs;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/direct-message")]
public class DirectMessageController : ControllerBase
{
    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IMailHandler mailHandler;
    private IHubContext<DirectMessageHub> dmHubContext;
    private IHubContext<NotificationsHub> notifyHubContext;
    private ILogger logger;
    private JsonSerializerOptions jsonSerializerOptions;

    public DirectMessageController(IConfiguration configuration, IPulseContext context, IMailHandler mailHandler, IHubContext<DirectMessageHub> dmHubContext, IHubContext<NotificationsHub> notifyHubContext, ILogger<DirectMessageController> logger)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.mailHandler = mailHandler;
        this.dmHubContext = dmHubContext;
        this.notifyHubContext = notifyHubContext;
        this.logger = logger;
        this.jsonSerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    //----   ADD DIRECT MESSAGE   ----
    [HttpPost]
    public async Task<IActionResult> AddDirectMessage(AddDirectMessage details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        try
        {

            // check if to user exists
            if (!(await dbContext.UserAccounts.Where(u => u.UserId == details.toId).AnyAsync()))
            {
                return NotFound(new Response { errorMessage = "To user does not exist", data = "" });
            }

            // check if from user exists
            var user = await dbContext.UserAccounts.Where(u => u.UserId == details.fromId).FirstOrDefaultAsync();
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "From user does not exist", data = "" });
            }

            // create dm
            var dm = new DirectMessage
            {
                FromId = details.fromId,
                ToId = details.toId,
                Content = details.content
            };

            // add dm
            await dbContext.DirectMessages.AddAsync(dm);
            await dbContext.SaveChangesAsync();

            // create new notification
            Notification notification = new Notification()
            {
                TypeId = 1,
                UserId = dm.ToId,
                Content = JsonSerializer.Serialize(new
                {
                    user.UserId,
                    user.Email,
                    user.FirstName,
                    user.LastName
                }, jsonSerializerOptions)
            };

            // add notification to database
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{dm.ToId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });
            // send ws message
            await dmHubContext.Clients.Group($"dm-{dm.ToId}").SendAsync(DirectMessageMethods.CLIENT_DIRECT_MESSAGE_RECEIVED, new
            {
                id = dm.Id,
                fromId = dm.FromId,
                toId = dm.ToId,
                dateSent = dm.DateSent,
                seen = dm.Seen,
                content = dm.Content
            });

            return CreatedAtAction(nameof(AddDirectMessage), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   GET ALL MESSAGES BETWEEN 2 USERS   ----
    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllMessagesBetween2Messages([FromQuery] int user1Id, [FromQuery] int user2Id)
    {
        try
        {
            // check if users exist
            if (await dbContext.UserAccounts.Where(u => u.UserId == user1Id || u.UserId == user2Id).CountAsync() < 2)
            {
                return NotFound(new Response { errorMessage = "One or both of the users does not exist", data = "" });
            }

            // get dms
            var dms = await (
                from dm in dbContext.DirectMessages
                where (dm.FromId == user1Id && dm.ToId == user2Id) || (dm.FromId == user2Id && dm.ToId == user1Id)
                orderby dm.DateSent ascending
                select dm
            ).ToListAsync();

            // set dms intended for user1 to seen
            dms.ForEach(dm =>
            {
                if (dm.FromId == user2Id)
                    dm.Seen = 1;
            });
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = dms });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   GET USERS BEING MESSAGED   ----
    [HttpGet]
    [Route("users/{userId}")]
    public async Task<IActionResult> GetUsersBeingMessaged(int userId)
    {
        try
        {
            // check if user exists
            var user = await dbContext.UserAccounts.Where(u => u.UserId == userId).FirstOrDefaultAsync();
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found", data = "" });
            }

            var users = await (
                from u in dbContext.UserAccounts
                from dm in dbContext.DirectMessages
                where (dm.FromId == u.UserId && dm.ToId == userId) || (dm.ToId == u.UserId && dm.FromId == userId)
                select new
                {
                    u.UserId,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.ProfilePicPath,
                    dm.DateSent,
                    dm.Seen,
                    dm.ToId
                }
            )
            .GroupBy(u => u.UserId)
            .OrderByDescending(u => u.Count(u => u.Seen == 0))
            .OrderByDescending(u => u.Max(u => u.DateSent))
            .Select(u => new
            {
                u.FirstOrDefault().UserId,
                u.FirstOrDefault().Email,
                u.FirstOrDefault().FirstName,
                u.FirstOrDefault().LastName,
                u.FirstOrDefault().ProfilePicPath,
                maxDate = u.Max(u => u.DateSent),
                unseen = u.Count(u => u.Seen == 0 && u.ToId == userId)
            })
            .ToListAsync();

            // get patients if user is doctor
            if (user.UserTypeId == 2)
            {
                users.UnionBy(await (
                    from u in dbContext.UserAccounts
                    join pd in dbContext.PatientDoctors on u.UserId equals pd.PatientId
                    where pd.DoctorId == user.UserId
                    select new
                    {
                        u.UserId,
                        u.Email,
                        u.FirstName,
                        u.LastName,
                        u.ProfilePicPath,
                        maxDate = new DateTime(),
                        unseen = 0
                    }
                ).ToListAsync(), u => u.UserId)
                .ToList();
            }

            // get doctors if user is patient
            if (user.UserTypeId == 3)
            {
                users.UnionBy(await (
                    from u in dbContext.UserAccounts
                    join pd in dbContext.PatientDoctors on u.UserId equals pd.DoctorId
                    where pd.PatientId == user.UserId
                    select new
                    {
                        u.UserId,
                        u.Email,
                        u.FirstName,
                        u.LastName,
                        u.ProfilePicPath,
                        maxDate = new DateTime(),
                        unseen = 0
                    }
                ).ToListAsync(), u => u.UserId)
                .ToList();
            }

            return Ok(new Response { errorMessage = "", data = users });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

}