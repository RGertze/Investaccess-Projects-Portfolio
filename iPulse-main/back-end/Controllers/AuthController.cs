using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using Pulse_back_end.Models;

namespace iPulse_back_end.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{

    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IMailHandler mailHandler;

    public AuthController(IConfiguration configuration, IPulseContext context, IMailHandler mailHandler)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.mailHandler = mailHandler;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok();
    }

    /// <summary>Logs in a user.</summary>
    /// <param name="loginDetails">The login details.</param>
    /// <returns>A response object containing the user's ID, role ID, and token.</returns>
    /*----   LOGIN   ----*/
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDetails loginDetails)
    {
        try
        {
            // check if valid params passed
            if (loginDetails is null)
                return BadRequest(new Response { errorMessage = "Invalid data passed in", data = "" });

            // find user with matching username
            var user = await dbContext.UserAccounts.Where(u => u.Email == loginDetails.username).FirstOrDefaultAsync();

            // check if user exists
            if (user is null)
                return NotFound(new Response { errorMessage = "User not found", data = "" });

            // check if passwords match
            if (user.Password != loginDetails.password)
                return StatusCode(403, new Response { errorMessage = "Incorrect Password", data = "" });

            // check if account confirmed
            if (user.IsConfirmed == 0)
            {
                return StatusCode(403, new Response { errorMessage = "Account not confirmed", data = "" });
            }

            // generate tokens
            var jwtHandler = new JwtHandler(configuration);
            var tokenString = jwtHandler.generate(user.UserId, user.UserTypeId);
            var refreshToken = jwtHandler.generateRefreshToken();

            // update user refresh token
            user.RefreshToken = refreshToken;

            // save changes in db
            dbContext.UserAccounts.Update(user);
            await dbContext.SaveChangesAsync();

            return Ok(new Response
            {
                errorMessage = "",
                data = new
                {
                    userId = user.UserId,
                    roleId = user.UserTypeId,
                    token = tokenString,
                    refreshToken = refreshToken
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    /// <summary>Registers a new user.</summary>
    /// <param name="details">The details of the new user.</param>
    /// <returns>A response indicating success or failure.</returns>
    /*----   USER REGISTRATION   ----*/
    [HttpPost("account/register")]
    public async Task<IActionResult> Register(UserRegistrationRequest details)
    {
        if (details is null)
        {
            return BadRequest(details);
        }

        // check for any null or empty values
        if (UserRegistrationRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        // check if user exists
        if (await dbContext.UserAccounts.FirstOrDefaultAsync(u => u.Email == details.email) != null)
            return Conflict(new Response { errorMessage = "User with that email already exists", data = "" });

        try
        {
            // create user account
            var user = new UserAccount
            {
                UserTypeId = (int)details.userType,

                Email = details.email,
                Password = details.password,
                FirstName = details.firstName,
                LastName = details.lastName,

                IsConfirmed = 0,
                IsActive = 0,

                ConfirmationCode = Guid.NewGuid().ToString(),     // generate new confirmation code
            };

            // add user to users
            await dbContext.UserAccounts.AddAsync(user);
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
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
        return CreatedAtAction(nameof(Register), new Response { errorMessage = "", data = new { message = "success" } });
    }

    /// <summary>Confirms an account.</summary>
    /// <param name="id">The user's ID.</param>
    /// <param name="code">The user's confirmation code.</param>
    /// <returns>An HTML page with a message indicating whether the account was confirmed or not.</returns>
    /*----   USER ACCOUNT CONFIRMATION   ----*/
    [HttpGet("account/confirm/{id}/{code}")]
    public async Task<IActionResult> ConfirmAccount(int id, string code)
    {
        // check if user exists
        var user = await dbContext.UserAccounts.FindAsync(id);
        if (user is null)
        {
            return new ContentResult { Content = HtmlBuilder.buildErrorMessage("User not found!"), ContentType = "text/html" };
        }

        // check if confirmation code matches
        if (user.ConfirmationCode != code)
        {
            return new ContentResult { Content = HtmlBuilder.buildErrorMessage("Incorrect confirmation code!"), ContentType = "text/html" };
        }

        try
        {
            // set user account to confirmed
            user.IsConfirmed = 1;
            dbContext.Update(user);
            await dbContext.SaveChangesAsync();

            var tuples = new List<Tuple<string, string>>(){
                new("{email}", user.Email),
                new("{loginLink}", HtmlBuilder.BaseUrl + $"/login")
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/confirmed.html", tuples);
            return new ContentResult { Content = htmlString, ContentType = "text/html" };
        }
        catch (Exception ex)
        {
            return new ContentResult { Content = HtmlBuilder.buildErrorMessage("Error confirming account! Please try again later!"), ContentType = "text/html" };
        }
    }

    /// <summary>Deregisters an account.</summary>
    /// <param name="id">The ID of the account to deregister.</param>
    /// <returns>An HTML page indicating the account was deregistered.</returns>
    /*----   USER ACCOUNT DEREGISTRATION   ----*/
    [HttpGet("account/deregister/{id}")]
    public async Task<IActionResult> DeregisterAccount(int id)
    {
        try
        {
            // check if user exists
            var user = await dbContext.UserAccounts.FindAsync(id);
            if (user is null)
            {
                return new ContentResult { Content = HtmlBuilder.buildErrorMessage("User not found!"), ContentType = "text/html" };
            }

            // remove user
            dbContext.UserAccounts.Remove(user);
            await dbContext.SaveChangesAsync();
            var tuples = new List<Tuple<string, string>>(){
                new("{email}",user.Email),
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/accountDeleted.html", tuples);

            return new ContentResult { Content = htmlString, ContentType = "text/html" };
        }
        catch (Exception ex)
        {
            return new ContentResult { Content = HtmlBuilder.buildErrorMessage("Error removing account! Please try again later!"), ContentType = "text/html" };
        }
    }

    /// <summary>Refreshes the token.</summary>
    /// <param name="details">The details.</param>
    /// <returns>The token.</returns>
    /*----   REFRESH AUTH TOKEN   ----*/
    [HttpPost("token/refresh")]
    public async Task<IActionResult> RefreshToken(RefreshTokenRequest details)
    {
        if (details is null)
        {
            return BadRequest(details);
        }

        // check for any null or empty values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        try
        {
            var jwtHandler = new JwtHandler(configuration);

            // get token details 
            var principal = jwtHandler.getPrincipalFromToken(details.token);

            // check if token is valid
            if (principal is null)
            {
                return BadRequest(new Response { errorMessage = "invalid token provided", data = "" });
            }

            // get userId and roleId from claims
            var uClaim = principal.Claims.Where(c => c.Type == "userId").FirstOrDefault();
            var rClaim = principal.Claims.Where(c => c.Type == "roleId").FirstOrDefault();

            if (uClaim is null || rClaim is null)
            {
                return BadRequest(new Response { errorMessage = "invalid token provided", data = "" });
            }

            var userId = uClaim.Value;
            var roleId = rClaim.Value;

            // get user
            var user = await dbContext.UserAccounts.Where(u => u.UserId.ToString() == userId).FirstOrDefaultAsync();
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found", data = "" });
            }

            // check if refresh tokens matches 
            if (user.RefreshToken != details.refreshToken)
            {
                return Unauthorized(new Response { errorMessage = "Refresh tokens do not match", data = "" });
            }

            // generate new tokens
            var newToken = jwtHandler.generate(Int32.Parse(userId), Int32.Parse(roleId));
            var newRefreshToken = jwtHandler.generateRefreshToken();

            // save refresh token in db
            user.RefreshToken = newRefreshToken;
            dbContext.UserAccounts.Update(user);
            await dbContext.SaveChangesAsync();

            // return tokens
            return Ok(new Response
            {
                errorMessage = "",
                data = new
                {
                    token = newToken,
                    refreshToken = newRefreshToken
                }
            });

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    /// <summary>Requests a password reset confirmation code.</summary>
    /// <param name="email">The email address of the user.</param>
    /// <returns>A response indicating whether the request was successful.</returns>
    /*----   REQUEST PASSWORD RESET CONFIRMATION CODE   ----*/
    [HttpGet("password/reset/{email}")]
    public async Task<IActionResult> RequestPasswordResetConfirmationCode(string email)
    {
        try
        {

            // check if user exists
            var user = await dbContext.UserAccounts.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found", data = "" });
            }

            // create new password reset attempt
            var pwResetAttempt = new PasswordResetAttempt
            {
                UserId = user.UserId,
                IpAddress = getClientIpAddress(),
                Expires = DateTime.UtcNow.AddMinutes(5),
                ConfirmationCode = (new Random().Next(100000, 1000000)).ToString("000-000")   // random 6 digit string
            };
            Console.WriteLine(pwResetAttempt.Expires);
            await dbContext.PasswordResetAttempts.AddAsync(pwResetAttempt);
            await dbContext.SaveChangesAsync();
            Console.WriteLine(pwResetAttempt.Expires.ToUniversalTime());

            // create confirmation code email html
            var tuples = new List<Tuple<string, string>>(){
                new("{confirmCode}",pwResetAttempt.ConfirmationCode)
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/PasswordResetEmail.html", tuples);

            // send confirmation email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Ipulse Mailer", configuration["MailSettings:Username"]));
            message.To.Add(new MailboxAddress(user.FirstName + " " + user.LastName, user.Email));
            message.Body = new TextPart("html")
            {
                Text = htmlString
            };

            this.mailHandler.sendMessage(message);

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while processing request. Try again later.", data = "" });
        }
    }

    /// <summary>Confirm a password reset attempt.</summary>
    /// <param name="details">The details of the password reset attempt.</param>
    /// <returns>A response indicating whether the attempt was successful.</returns>
    /*----   CONFIRM PASSWORD RESET   ----*/
    [HttpPost("password/reset/confirm")]
    public async Task<IActionResult> ConfirmPasswordReset(ConfirmPasswordReset details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        try
        {
            // check if user exists
            var user = await dbContext.UserAccounts.FirstOrDefaultAsync(u => u.Email == details.email);
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found", data = "" });
            }

            // get latest password reset attempt
            var resetAttempt = await dbContext.PasswordResetAttempts.Where(p => p.UserId == user.UserId).OrderByDescending(p => p.CreatedAt).FirstOrDefaultAsync();
            if (resetAttempt is null)
            {
                return NotFound(new Response { errorMessage = "No password reset attempt found", data = "" });
            }

            // check if attempt expired
            if (resetAttempt.Expires.CompareTo(DateTime.UtcNow) < 0)
            {
                return StatusCode(410, new Response { errorMessage = "Code has expired. Request a new one", data = "" });
            }

            // check if codes match
            if (!resetAttempt.ConfirmationCode.Equals(details.confirmationCode))
            {
                return StatusCode(403, new Response { errorMessage = "Code has expired. Request a new one", data = "" });
            }

            // set attempt to confirmed
            resetAttempt.Confirmed = 1;
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

    /// <summary>Reset a user's password.</summary>
    /// <param name="details">The details of the password reset attempt.</param>
    /// <returns>A response indicating whether the password reset attempt was successful.</returns>
    /*----   RESET PASSWORD   ----*/
    [HttpPost("password/reset")]
    public async Task<IActionResult> ResetPassword(ResetPassword details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        try
        {
            // check if user exists
            var user = await dbContext.UserAccounts.FirstOrDefaultAsync(u => u.Email == details.email);
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found", data = "" });
            }

            // get latest password reset attempt
            var resetAttempt = await dbContext.PasswordResetAttempts.Where(p => p.UserId == user.UserId).OrderByDescending(p => p.CreatedAt).FirstOrDefaultAsync();
            if (resetAttempt is null)
            {
                return NotFound(new Response { errorMessage = "No password reset attempt found", data = "" });
            }

            // check if attempt expired
            if (resetAttempt.Expires.CompareTo(DateTime.UtcNow) < 0)
            {
                return StatusCode(410, new Response { errorMessage = "Password reset attempt has expired, request a new confirmation code and try again", data = "" });
            }

            // check if attempt confirmed
            if (resetAttempt.Confirmed == 0)
            {
                return StatusCode(403, new Response { errorMessage = "Confirmation code has not been verified", data = "" });
            }

            // check if attempt has been used
            if (resetAttempt.Used == 1)
            {
                return StatusCode(410, new Response { errorMessage = "This password reset attempt has already been used. Request a new reset.", data = "" });
            }

            // set attempt to used to prevent further password changes using same attempt
            resetAttempt.Used = 1;
            await dbContext.SaveChangesAsync();

            // update password
            user.Password = details.password;
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    /// <summary>Retrieves the client's IP address.</summary>
    /// <returns>The client's IP address.</returns>
    /*----   GET CLIENT IP ADDRESS   ----*/
    private string getClientIpAddress()
    {
        string ipList = Request.Headers["HTTP_X_FORWARDED_FOR"];
        if (!string.IsNullOrEmpty(ipList))
        {
            return ipList.Split(',')[ipList.Length - 1];    // get last ip in list
        }

        string ip = Request.Headers["REMOTE_ADDR"];
        if (!string.IsNullOrEmpty(ip))
        {
            return ip;
        }

        var remoteIp = Request.HttpContext.Connection.RemoteIpAddress;
        if (remoteIp is null)
        {
            return "0.0.0.0";
        }

        ip = remoteIp.MapToIPv4().ToString();

        return ip;
    }
}