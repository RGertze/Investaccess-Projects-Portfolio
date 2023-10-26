using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ParentController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private ParentsService parentsService;

    public ParentController(IConfiguration configuration, SCA_ITSContext context, ParentsService parentsService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.parentsService = parentsService;
    }

    //---   GET PARENT PROFLE  ---
    [HttpGet("profile/{id}")]
    public async Task<IActionResult> GetParentProfile(int id)
    {
        try
        {
            var parent = await dbContext.Parents.Where(p => p.UserId == id).Select(p => new
            {
                p.UserId,
                p.IdNumber,
                p.Employer,
                p.Occupation,
                p.MonthlyIncome,
                p.WorkingHours,
                p.SpecialistSkillsHobbies,
                p.TelephoneWork,
                p.TelephoneHome,
                p.Fax,
                p.CellNumber,
                p.PostalAddress,
                p.ResidentialAddress,
                p.MaritalStatus,
                p.RegistrationStage
            }).FirstOrDefaultAsync();

            if (parent is null)
                return NotFound(new Response { errorMessage = "Parent not found", data = "" });

            return Ok(new Response { errorMessage = "", data = parent });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   EDIT PARENT PROFILE  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpPost("profile/edit")]
    public async Task<IActionResult> EditParentProfile(EditParentProfileRequest details)
    {
        try
        {
            var result = await parentsService.Edit(details);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   ADD PARENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("add")]
    public async Task<IActionResult> AddParent(AddNewParentRequest details)
    {
        try
        {
            var result = await parentsService.Add(details, true, true, true);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   GET ALL PARENTS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await parentsService.GetAll();
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }
}