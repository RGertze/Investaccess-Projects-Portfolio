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
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IMailHandler mailHandler;
    private IHubContext<NotificationsHub> notifyHubContext;
    private ILogger logger;
    private JsonSerializerOptions jsonSerializerOptions;

    public NotificationsController(IConfiguration configuration, IPulseContext context, IMailHandler mailHandler, IHubContext<NotificationsHub> notifyHubContext, ILogger<NotificationsController> logger)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.mailHandler = mailHandler;
        this.notifyHubContext = notifyHubContext;
        this.logger = logger;
        this.jsonSerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    //----   GET UNSEEN NOTIFICATIONS   ----
    /// <summary>Retrieves the unseen notifications for a user.</summary>
    /// <param name="userId">The user's ID.</param>
    /// <returns>The unseen notifications for the user.</returns>
    [HttpGet]
    [Route("unseen/{userId}")]
    public async Task<IActionResult> GetUnseenNotifications(int userId)
    {
        try
        {
            // get notifications
            var notifications = await (
                from notif in dbContext.Notifications
                where notif.UserId == userId && notif.Seen == 0
                orderby notif.DateSent descending
                select notif
            ).ToListAsync();

            // set notifications to seen
            notifications.ForEach(notif =>
            {
                notif.Seen = 1;
            });
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = notifications });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   GET ALL NOTIFICATIONS   ----
    /// <summary>Retrieves all notifications for a user.</summary>
    /// <param name="userId">The user's ID.</param>
    /// <returns>A list of notifications.</returns>
    [HttpGet]
    [Route("all/{userId}")]
    public async Task<IActionResult> GetAllNotifications(int userId)
    {
        try
        {
            // get notifications
            var notifications = await (
                from notif in dbContext.Notifications
                where notif.UserId == userId
                orderby notif.DateSent descending
                select notif
            ).ToListAsync();

            // set notifications to seen
            notifications.ForEach(notif =>
            {
                notif.Seen = 1;
            });
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = notifications });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   CHECK FOR NOTIFICATIONS   ----
    /// <summary>Checks if there are any unseen notifications for the user.</summary>
    /// <param name="userId">The user's id.</param>
    /// <returns>A response object containing the unseen notifications.</returns>
    [HttpGet]
    [Route("check/{userId}")]
    public async Task<IActionResult> CheckForNotifications(int userId)
    {
        try
        {
            // check for unseen notifications
            var unseenNotifications = await dbContext.Notifications.Where(n => n.UserId == userId && n.Seen == 0).AnyAsync();

            return Ok(new Response { errorMessage = "", data = new { unseen = unseenNotifications } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }
}