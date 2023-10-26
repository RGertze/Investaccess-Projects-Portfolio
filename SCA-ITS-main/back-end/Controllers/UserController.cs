using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private ParentsService parentsService;
    private UserService userService;

    public UserController(IConfiguration configuration, SCA_ITSContext context, ParentsService parentsService, UserService userService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.parentsService = parentsService;
        this.userService = userService;
    }

    //---   GET USER   ---
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        try
        {
            var user = await dbContext.UserAccounts.Where(u => u.UserId == id).Select(u => new
            {
                userId = u.UserId,
                email = u.Email,
                firstName = u.FirstName,
                lastName = u.LastName,
                isApproved = u.IsApproved,
                u.ProfilePicPath
            }).FirstOrDefaultAsync();

            if (user is null)
            {
                return NotFound();
            }

            return Ok(new Response { errorMessage = "", data = user });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET USER PROFILE PIC   ---
    [HttpGet("profile-pic/{id}")]
    public async Task<IActionResult> GetUserProfilePic(int id)
    {
        try
        {
            var user = await dbContext.UserAccounts.Where(u => u.UserId == id).Select(u => new
            {
                profilePicPath = u.ProfilePicPath
            }).FirstOrDefaultAsync();

            if (user is null)
            {
                return NotFound();
            }

            return Ok(new Response { errorMessage = "", data = user });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   UPDATE USER PROFILE PIC   ---
    [HttpPost("profile-pic")]
    public async Task<IActionResult> UpdateUserProfilePic(UserProfilePicUpdateRequest details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(new Response { errorMessage = "Invalid data provided!", data = "" });
        }
        try
        {
            // get user
            var user = await dbContext.UserAccounts.Where(p => p.UserId == details.userId).FirstOrDefaultAsync();
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found!", data = "" });
            }

            // update profile values
            user.ProfilePicPath = details.profilePicPath;

            // update db
            dbContext.UserAccounts.Update(user);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "successful" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Error updating user! Try again later", data = "" });
        }
    }

    //---   UPDATE USER   ---
    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser(UserUpdateRequest details)
    {
        try
        {
            var result = await userService.Edit(details, true);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Error updating user! Try again later", data = "" });
        }
    }

    //---   DELETE USER  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("{userId}")]
    public async Task<IActionResult> Delete(int userId)
    {
        try
        {
            var result = await userService.Delete(userId, true);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, ex.Message);
        }
    }

    //---   UPDATE PASSWORD  ---
    [HttpPost("password/edit")]
    public async Task<IActionResult> UpdatePassword(UpdateUserPassword details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return BadRequest(new Response { errorMessage = "Empty values!", data = 400 });

            // check claims
            var claim = this.User.FindFirst("userId");
            if (claim is null)
            {
                return StatusCode(403, new Response { errorMessage = "Invalid token provided", data = "" });
            }
            var userId = Int64.Parse(claim.Value);

            if (userId != details.userId)
                return StatusCode(403, new Response { errorMessage = "You do not have access", data = "" });

            var result = await userService.EditPassword(details);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, ex.Message);
        }
    }
}