using System.Text.Json;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using Pulse_back_end.Models;
using SignalRWebpack.Hubs;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/receptionists")]
public class ReceptionistsController : ControllerBase
{
    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IMailHandler mailHandler;
    private IHubContext<NotificationsHub> notifyHubContext;
    private ILogger logger;
    private JsonSerializerOptions jsonSerializerOptions;

    public ReceptionistsController(IConfiguration configuration, IPulseContext context, IMailHandler mailHandler, IHubContext<NotificationsHub> notifyHubContext, ILogger<ReceptionistsController> logger)
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

    //----   GET RECEPTIONIST   ----
    /// <summary>Gets a receptionist's information.</summary>
    /// <param name="receptionistId">The receptionist's ID.</param>
    /// <returns>The receptionist's information.</returns>
    [HttpGet]
    [Route("{receptionistId}")]
    public async Task<IActionResult> Get(int receptionistId)
    {
        try
        {
            // get receptionists
            var receptionist = await (
                from u in dbContext.UserAccounts
                join r in dbContext.Receptionists on u.UserId equals r.UserId
                where u.UserId == receptionistId
                select new
                {
                    u.UserId,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.ProfilePicPath,
                    r.DoctorId
                }
            ).FirstOrDefaultAsync();

            if (receptionist is null)
            {
                return NotFound(new Response { errorMessage = "Receptionist not found", data = "" });
            }

            return Ok(new Response { errorMessage = "", data = receptionist });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   ADD RECEPTIONIST   ----
    /// <summary>Adds a receptionist to the database.</summary>
    /// <param name="details">The details of the receptionist to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost]
    public async Task<IActionResult> Add(AddReceptionistRequest details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        try
        {
            // check if user exists
            if (await dbContext.UserAccounts.Where(u => u.Email == details.email).AnyAsync())
            {
                return Conflict(new Response { errorMessage = "User with that email already exists", data = "" });
            }

            // check if doctor exists
            if (!await dbContext.DoctorProfiles.Where(d => d.UserId == details.doctorId).AnyAsync())
            {
                return NotFound(new Response { errorMessage = "Doctor not found", data = "" });
            }

            // create user
            var user = new UserAccount
            {
                UserTypeId = 4,

                Email = details.email,
                Password = details.password,
                FirstName = details.firstName,
                LastName = details.lastName,

                IsConfirmed = 0,
                IsActive = 0,

                ConfirmationCode = Guid.NewGuid().ToString(),     // generate new confirmation code
            };

            // save user
            await dbContext.UserAccounts.AddAsync(user);
            await dbContext.SaveChangesAsync();

            // create receptionist record
            Receptionist receptionist = new Receptionist
            {
                DoctorId = (int)details.doctorId,
                UserId = user.UserId
            };

            // save receptionist record
            await dbContext.Receptionists.AddAsync(receptionist);
            await dbContext.SaveChangesAsync();

            // create confirmation email html
            string baseUrl = HtmlBuilder.BaseUrl;
            var tuples = new List<Tuple<string, string>>(){
                new("{confirmUrl}",baseUrl+"/api/auth/account/confirm/"+user.UserId+"/"+user.ConfirmationCode),
                new("{deregisterUrl}",baseUrl+"/api/auth/account/deregister/"+user.UserId)
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/confirmationEmail.html", tuples);

            // send confirmation email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Ipulse Mailer", configuration["MailSettings:Username"]));
            message.To.Add(new MailboxAddress(user.FirstName + " " + user.LastName, user.Email));
            message.Body = new TextPart("html")
            {
                Text = htmlString
            };

            this.mailHandler.sendMessage(message);

            return CreatedAtAction(nameof(Add), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   GET RECEPTIONIST FOR DOCTOR   ----
    /// <summary>Gets the receptionists for a doctor.</summary>
    /// <param name="doctorId">The doctor's ID.</param>
    /// <returns>The receptionists for the doctor.</returns>
    [HttpGet]
    [Route("all/{doctorId}")]
    public async Task<IActionResult> GetReceptionistsForDoctor(int doctorId)
    {
        try
        {
            // check if doctor exist
            if (!await dbContext.UserAccounts.Where(u => u.UserId == doctorId && u.UserTypeId == 2).AnyAsync())
            {
                return NotFound(new Response { errorMessage = "Doctor not found", data = "" });
            }

            // get receptionists
            var receptionists = await (
                from u in dbContext.UserAccounts
                join r in dbContext.Receptionists on u.UserId equals r.UserId
                where r.DoctorId == doctorId
                select new
                {
                    u.UserId,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.ProfilePicPath,
                    r.DoctorId
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = receptionists });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   DELETE RECEPTIONIST   ----
    /// <summary>Deletes a receptionist.</summary>
    /// <param name="receptionistId">The receptionist's ID.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [HttpDelete]
    [Route("{receptionistId}")]
    public async Task<IActionResult> Delete(int receptionistId)
    {
        try
        {
            // check if receptionist exist
            var receptionist = await dbContext.UserAccounts.Where(u => u.UserId == receptionistId && u.UserTypeId == 4).FirstOrDefaultAsync();
            if (receptionist is null)
            {
                return NotFound(new Response { errorMessage = "Receptionist not found", data = "" });
            }

            // delete receptionist from db
            dbContext.UserAccounts.Remove(receptionist);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }
}