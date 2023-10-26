using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[ApiController]
[Route("api/moodle-sync")]
public class MoodleSyncController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private MoodleSyncService moodleSyncService;

    public MoodleSyncController(IConfiguration configuration, SCA_ITSContext context, MoodleSyncService moodleSyncService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.moodleSyncService = moodleSyncService;
    }

    #region User sync

    //---   SYNC CREATED USERS   ---
    /// <summary>Syncs created moodle users with local ones.</summary>
    /// <param name="details">The details of the user to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("users/created")]
    public async Task<IActionResult> SyncCreatedUsers(SyncUserCreatedUpdatedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncCreatedUser(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   SYNC UPDATED USERS   ---
    /// <summary>Syncs updated moodle users with local ones.</summary>
    /// <param name="details">The details of the user to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("users/updated")]
    public async Task<IActionResult> SyncUpdatedUsers(SyncUserCreatedUpdatedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncUpdatedUser(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   SYNC DELETED USERS   ---
    /// <summary>Syncs deleted moodle users with local ones.</summary>
    /// <param name="details">The details of the user to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("users/deleted")]
    public async Task<IActionResult> SyncDeletedUsers(SyncUserDeletedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncDeletedUser(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    #endregion

    #region Course category sync

    //---   SYNC CREATED CATEGORIES   ---
    /// <summary>Syncs created moodle categories with local ones.</summary>
    /// <param name="details">The details of the category to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("categories/created")]
    public async Task<IActionResult> SyncCreatedCategories(SyncCourseCategoryCreatedUpdatedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncCreatedCourseCategory(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   SYNC UPDATED CATEGORIES   ---
    /// <summary>Syncs updated moodle categories with local ones.</summary>
    /// <param name="details">The details of the category to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("categories/updated")]
    public async Task<IActionResult> SyncUpdatedCategories(SyncCourseCategoryCreatedUpdatedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncUpdatedCourseCategory(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   SYNC DELETED CATEGORIES   ---
    /// <summary>Syncs deleted moodle categories with local ones.</summary>
    /// <param name="details">The details of the category to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("categories/deleted")]
    public async Task<IActionResult> SyncDeletedCategories(SyncCourseCategoryDeletedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncDeletedCourseCategory(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    #endregion

    #region Course  sync


    //---   SYNC CREATED COURSES   ---
    /// <summary>Syncs created moodle courses with local ones.</summary>
    /// <param name="details">The details of the  to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("courses/created")]
    public async Task<IActionResult> SyncCreatedCourses(SyncCourseCreatedUpdatedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncCreatedCourse(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   SYNC UPDATED COURSES   ---
    /// <summary>Syncs updated moodle courses with local ones.</summary>
    /// <param name="details">The details of the  to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("courses/updated")]
    public async Task<IActionResult> SyncUpdatedCourses(SyncCourseCreatedUpdatedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncUpdatedCourse(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   SYNC DELETED COURSES   ---
    /// <summary>Syncs deleted moodle courses with local ones.</summary>
    /// <param name="details">The details of the  to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("courses/deleted")]
    public async Task<IActionResult> SyncDeletedCourses(SyncCourseDeletedRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["Moodle_Sync:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncDeletedCourse(details);
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    #endregion

    #region Sync all

    //---   SYNC ALL   ---
    /// <summary>Syncs moodle data locally.</summary>
    /// <param name="details">The details of to sync.</param>
    /// <returns>A response indicating success or failure.</returns>
    [HttpPost("all")]
    public async Task<IActionResult> SyncAll(SyncAllRequest details)
    {
        try
        {
            if (details.token is null)
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            // check for valid token
            if (details.token != configuration["AWS_LAMBDA:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await moodleSyncService.SyncAllEnqueue();
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("its-users")]
    public async Task<IActionResult> SyncAllITSUsers(SyncAllRequest details)
    {
        try
        {
            var result = await moodleSyncService.SyncAllITSUsersEnqueue();
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

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }


    #endregion
}