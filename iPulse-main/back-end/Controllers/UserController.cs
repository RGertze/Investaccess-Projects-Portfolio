using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse_back_end.Models;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;

    public UserController(IConfiguration configuration, IPulseContext context)
    {
        this.configuration = configuration;
        this.dbContext = context;
    }

    //---   GET USER   ---
    /// <summary>Gets a user's information.</summary>
    /// <param name="id">The user's ID.</param>
    /// <returns>The user's information.</returns>
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

    //---   GET USER PROFILE PIC   ---
    /// <summary>Retrieves the profile picture of a user.</summary>
    /// <param name="id">The user's ID.</param>
    /// <returns>The profile picture of the user.</returns>
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
    /// <summary>Updates the user's profile picture.</summary>
    /// <param name="details">The details of the profile picture to update.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
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
    /// <summary>Updates a user's information.</summary>
    /// <param name="details">The user's updated information.</param>
    /// <returns>A response indicating whether the update was successful.</returns>
    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser(UserUpdateRequest details)
    {
        try
        {
            // get user
            var user = await dbContext.UserAccounts.Where(p => p.Email == details.email).FirstOrDefaultAsync();
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found!", data = "" });
            }

            // update profile values
            user.FirstName = (user.FirstName == details.firstName || details.firstName is null) ? user.FirstName : details.firstName;
            user.LastName = (user.LastName == details.lastName || details.lastName is null) ? user.LastName : details.lastName;

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

    //---   GET ALL USERS   ---
    /// <summary>Retrieves all users.</summary>
    /// <returns>All users.</returns>
    /// <exception cref="Exception">Thrown when an exception occurred.</exception>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await (
                from user in dbContext.UserAccounts
                join userType in dbContext.UserTypes on user.UserTypeId equals userType.UserTypeId
                select new
                {
                    userId = user.UserId,
                    userType.UserTypeId,
                    userType.UserTypeName,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    profilePicPath = user.ProfilePicPath,
                    user.IsActive
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = users });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL DOCTORS   ---
    /// <summary>Retrieves all doctors.</summary>
    /// <returns>All doctors.</returns>
    [HttpGet("doctors")]
    public async Task<IActionResult> GetDoctorsAll()
    {
        try
        {
            var doctors = await (
                from user in dbContext.UserAccounts
                join doc in dbContext.DoctorProfiles on user.UserId equals doc.UserId
                join specialty in dbContext.DoctorSpecialties on doc.SpecialtyId equals specialty.SpecialtyId
                select new
                {
                    userId = user.UserId,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    specialty = specialty.SpecialtyName,
                    practiceName = doc.PracticeName
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = doctors });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL PATIENTS   ---
    /// <summary>Gets all patients.</summary>
    /// <returns>A list of patients.</returns>
    [HttpGet("patients")]
    public async Task<IActionResult> GetPatientsAll()
    {
        try
        {
            var patients = await (
                from user in dbContext.UserAccounts
                join patient in dbContext.PatientProfiles on user.UserId equals patient.UserId
                select new
                {
                    userId = user.UserId,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    profilePicPath = user.ProfilePicPath
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = patients });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    /*----   DOCTOR REGISTRATION    ----*/
    /// <summary>Register a doctor.</summary>
    /// <param name="details">The details of the doctor to register.</param>
    /// <returns>A response indicating whether the registration was successful.</returns>
    [AllowAnonymous]
    [HttpPost("doctor/register")]
    public async Task<IActionResult> DoctorRegistration(DoctorRegistrationRequest details)
    {
        if (details is null)
        {
            return BadRequest();
        }

        // check for any null or empty values
        if (DoctorRegistrationRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        // check if user exists
        var user = await dbContext.UserAccounts.Select(u => new { u.UserId, u.Email }).Where(u => u.Email == details.email).FirstOrDefaultAsync();
        if (user is null)
            return NotFound(new Response { errorMessage = "User not found", data = "" });

        // check if profile exists
        var profile = await dbContext.DoctorProfiles.Select(p => new { p.UserId }).Where(p => p.UserId == user.UserId).FirstOrDefaultAsync();
        if (profile != null)
        {
            return Conflict(new Response { errorMessage = "profile already exists", data = "" });
        }

        try
        {
            // create doctor profile
            var docProfile = new DoctorProfile
            {
                UserId = user.UserId,
                SpecialtyId = details.specialty ?? 1,
                Nationality = details.nationality,
                PracticeName = details.practiceName,
                PracticeNumber = details.practiceNumber
            };

            // add profile to profiles
            await dbContext.DoctorProfiles.AddAsync(docProfile);
            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }

        return CreatedAtAction(nameof(DoctorRegistration), new Response { errorMessage = "", data = new { message = "success" } });
    }

    /*----   PATIENT REGISTRATION   ----*/
    /// <summary>Patient registration.</summary>
    /// <param name="details">The details.</param>
    /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
    [AllowAnonymous]
    [HttpPost("patient/register")]
    public async Task<IActionResult> PatientRegistration(PatientRegistrationRequest details)
    {
        if (details is null)
        {
            return BadRequest();
        }

        // check for any null or empty values
        if (DoctorRegistrationRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        // check if user exists
        var user = await dbContext.UserAccounts.Select(u => new { u.UserId, u.Email }).Where(u => u.Email == details.email).FirstOrDefaultAsync();
        if (user is null)
            return NotFound(new Response { errorMessage = "User not found", data = "" });


        // check if profile exists
        var profile = await dbContext.PatientProfiles.Select(p => new { p.UserId }).Where(p => p.UserId == user.UserId).FirstOrDefaultAsync();
        if (profile != null)
        {
            return Conflict(new Response { errorMessage = "profile already exists", data = "" });
        }

        try
        {
            // create patient profile
            var patientProfile = new PatientProfile
            {
                UserId = user.UserId,
                MedicalAidSchemeId = details.medicalAidScheme ?? 1,
                MemberNumber = details.memberNumber,
                IdNumber = details.idNumber
            };

            // add profile to profiles
            await dbContext.PatientProfiles.AddAsync(patientProfile);
            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }

        return CreatedAtAction(nameof(PatientRegistration), new Response { errorMessage = "", data = new { message = "success" } });
    }

    //---   UPDATE USER ACCOUNT STATUS   ---
    /// <summary>Updates the status of a user's account.</summary>
    /// <param name="details">The details of the user's account.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [HttpPost("account-status")]
    public async Task<IActionResult> UpdateUserAccountStatus(UpdateUserAccountStatus details)
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

            // check if status out of range
            if (details.status < 0 || details.status > 1)
            {
                return BadRequest(new Response { errorMessage = "Status should either be 0 or 1", data = "" });
            }

            // update profile values
            user.IsActive = (ulong)details.status;

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

    //----   DELETE USER   ----
    /// <summary>Deletes user's account</summary>
    /// <param name="userId">User's account ID</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("{userId}")]
    public async Task<IActionResult> Delete(int userId)
    {
        try
        {
            // check if user exist
            var user = await dbContext.UserAccounts.Where(u => u.UserId == userId).FirstOrDefaultAsync();
            if (user is null)
            {
                return NotFound(new Response { errorMessage = "User not found", data = "" });
            }

            // delete user from db
            dbContext.UserAccounts.Remove(user);
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