using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private StaffService staffService;

    public StaffController(IConfiguration configuration, SCA_ITSContext context, StaffService staffService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.staffService = staffService;
    }

    //---   GET STAFF  ---
    [HttpGet("{staffId}")]
    public async Task<IActionResult> GetStaff(int staffId)
    {
        try
        {
            var result = await staffService.GetOne(staffId);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL STAFF  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllStaff()
    {
        try
        {
            var result = await staffService.GetAll();
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   ADD STAFF   ---
    /// <summary>Adds a new staff member to the database.</summary>
    /// <param name="details">The details of the staff member to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost]
    public async Task<IActionResult> AddStaff(AddStaffRequest details)
    {
        try
        {
            var result = await staffService.Add(details, true);
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

}