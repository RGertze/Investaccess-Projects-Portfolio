using System.Data.Common;
using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace iPulse_back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : Controller
{
    private IConfiguration configuration;
    private IMailHandler mailHandler;
    private IPulseContext dbContext;

    public TestController(IConfiguration configuration, IMailHandler mailHandler, IPulseContext dbContext)
    {
        this.configuration = configuration;
        this.mailHandler = mailHandler;
        this.dbContext = dbContext;
    }

    [HttpGet("mail/send")]
    public IActionResult SendMail()
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Ipulse Mailer", "info@igigtechnologies.com"));
        message.To.Add(new MailboxAddress("john Adriaans", "adriaanscorne@gmail.com"));
        message.Body = new TextPart("Plain")
        {
            Text = "This is a test"
        };

        using (var client = new SmtpClient())
        {
            client.ServerCertificateValidationCallback = (s, c, h, e) => true;
            client.Connect(configuration["MailSettings:Host"], Int32.Parse(configuration["MailSettings:Port"]));
            client.Authenticate(configuration["MailSettings:Username"], configuration["MailSettings:Password"]);
            client.Send(message);
            client.Disconnect(true);
        }

        return Ok();
    }

    [HttpGet("email/confirmation")]
    public IActionResult GetConfirmationHtmlString()
    {
        var tuples = new List<Tuple<string, string>>(){
            new("{confirmUrl}","http://localhost:5008/api/auth/account/confirm/abcdefg"),
            new("{deregisterUrl}","http://localhost:5008/api/auth/account/deregister/email@email.com")
        };
        string data = HtmlBuilder.build("/Html_Templates/confirmationEmail.html", tuples);

        return Content(data);
    }

    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("auth/patient")]
    public IActionResult GetPatient()
    {
        return Ok(new { message = "success" });
    }

    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpGet("auth/doctor")]
    public IActionResult GetDoctor()
    {
        return Ok(new { message = "success" });
    }

    [HttpGet("expired-token")]
    public IActionResult GetExpiredToken()
    {
        string token = (new JwtHandler(configuration)).generateExpired(2, 2);
        return Ok(new { token = token, data = Request.Headers, ip = Request.HttpContext.Connection.RemoteIpAddress.ToString() });
    }

    [HttpGet("chat-users-by-message-date-descending")]
    public async Task<IActionResult> GetChatUsersByMessageDateDescending()
    {
        // get users
        // var users = await (
        //     from u in dbContext.UserAccounts
        //     from dm in dbContext.DirectMessages
        //     where (dm.FromId == u.UserId && dm.ToId == 2) || (dm.ToId == u.UserId && dm.FromId == 2)
        //     group u by u.UserId into uGroup
        //     select new
        //     {
        //         uGroup.FirstOrDefault().UserId,
        //         uGroup.FirstOrDefault().Email,
        //         uGroup.FirstOrDefault().FirstName,
        //         uGroup.FirstOrDefault().LastName,
        //         uGroup.FirstOrDefault().ProfilePicPath,
        //     }
        // ).ToListAsync();
        var users = await (
            from u in dbContext.UserAccounts
            from dm in dbContext.DirectMessages
            where (dm.FromId == u.UserId && dm.ToId == 2) || (dm.ToId == u.UserId && dm.FromId == 2)
            select new
            {
                u.UserId,
                u.Email,
                u.FirstName,
                u.LastName,
                u.ProfilePicPath,
                dm.DateSent,
                dm.Seen
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
            unseen = u.Count(u => u.Seen == 0)
        })
        .ToListAsync();
        return Ok(new { users = users });
    }
}