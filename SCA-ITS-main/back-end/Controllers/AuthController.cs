using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using Pulse_back_end.Models;

namespace SCA_ITS_back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private IMailHandler mailHandler;
    private ParentsService parentsService;

    public AuthController(IConfiguration configuration, SCA_ITSContext context, IMailHandler mailHandler, ParentsService parentsService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.mailHandler = mailHandler;
        this.parentsService = parentsService;
    }

    /// <summary>Returns a 200 OK response.</summary>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok();
    }

    /*----   LOGIN   ----*/
    /// <summary>Logs in a user.</summary>
    /// <param name="loginDetails">The login details.</param>
    /// <returns>A response object containing the user's id, role id, access token, refresh token, and whether or not the user is approved.</returns>
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
            user.LastLogin = DateTime.Now;

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
                    refreshToken = refreshToken,
                    isApproved = user.IsApproved,
                    lastLogin = user.LastLogin
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


    /*----   USER REGISTRATION   ----*/
    /// <summary>Register a new user.</summary>
    /// <param name="details">The details of the new user.</param>
    /// <returns>A response indicating whether the user was registered successfully.</returns>
    [HttpPost("account/register")]
    public async Task<IActionResult> Register(UserRegistrationRequest details)
    {
        try
        {
            var result = await parentsService.Add(new AddNewParentRequest()
            {
                email = details.email,
                firstName = details.firstName,
                lastName = details.lastName,
                password = details.password,
            }, false, false, false);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            var user = await dbContext.UserAccounts.Where(u => u.Email == details.email).FirstAsync();

            // create confirmation email html

            string baseUrl = HtmlBuilder.BaseUrl;
            var tuples = new List<Tuple<string, string>>(){
                new("{confirmUrl}",baseUrl+"/api/auth/account/confirm/"+user.UserId+"/"+user.ConfirmationCode),
                new("{deregisterUrl}",baseUrl+"/api/auth/account/deregister/"+user.UserId)
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/confirmationEmail.html", tuples);

            // send confirmation email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("SCA ITS", configuration["MailSettings:FromMail"]));
            message.To.Add(new MailboxAddress(user.FirstName + " " + user.LastName, user.Email));
            message.Body = new TextPart("html")
            {
                Text = htmlString
            };

            this.mailHandler.sendMessage(message);

            return CreatedAtAction(nameof(Register), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    /*----   USER ACCOUNT CONFIRMATION   ----*/
    /// <summary>Confirms an account.</summary>
    /// <param name="id">The user's ID.</param>
    /// <param name="code">The user's confirmation code.</param>
    /// <returns>A redirect to the appropriate page.</returns>
    [HttpGet("account/confirm/{id}/{code}")]
    public async Task<IActionResult> ConfirmAccount(int id, string code)
    {
        // check if user exists
        var user = await dbContext.UserAccounts.FindAsync(id);
        if (user is null)
        {
            return Redirect($"{HtmlBuilder.BaseUrl}/info/error-message/{(int)ErrorMessageCode.USER_NOT_FOUND}");
        }

        // check if confirmation code matches
        if (user.ConfirmationCode != code)
        {
            return Redirect($"{HtmlBuilder.BaseUrl}/info/error-message/{(int)ErrorMessageCode.WRONG_CONFIRMATION_CODE}");
        }

        try
        {
            // set user account to confirmed
            user.IsConfirmed = 1;
            dbContext.Update(user);
            await dbContext.SaveChangesAsync();

            return Redirect($"{HtmlBuilder.BaseUrl}/info/success-message/{(int)SuccessMessageCode.REGISTRATION_SUCCESSFUL}");
        }
        catch (Exception ex)
        {
            return Redirect($"{HtmlBuilder.BaseUrl}/info/error-message/{(int)ErrorMessageCode.SERVER_ERROR}");
        }
    }

    /*----   USER ACCOUNT DEREGISTRATION   ----*/
    /// <summary>Deregisters an account.</summary>
    /// <param name="id">The ID of the account to deregister.</param>
    /// <returns>A <see cref="ContentResult"/> containing the result of the deregistration.</returns>
    [HttpGet("account/deregister/{id}")]
    public async Task<IActionResult> DeregisterAccount(int id)
    {
        // check if user exists
        var user = await dbContext.UserAccounts.FindAsync(id);
        if (user is null)
        {
            return new ContentResult { Content = "<div><h1>User does not exist</h1></div>", ContentType = "text/html" };
        }

        try
        {
            // remove user
            dbContext.UserAccounts.Remove(user);
            await dbContext.SaveChangesAsync();
            return new ContentResult { Content = "<div><h1>Account Confirmed!</h1></div>", ContentType = "text/html" };
        }
        catch (Exception ex)
        {
            return new ContentResult { Content = "<div><h1>Account successfully removed!</h1></div>", ContentType = "text/html" };
        }
    }

    /*----   REFRESH AUTH TOKEN   ----*/
    /// <summary>Refreshes the token.</summary>
    /// <param name="details">The details.</param>
    /// <returns>The token.</returns>
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
            var principal = jwtHandler.getPrincipalFromExpiredToken(details.token);

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
}