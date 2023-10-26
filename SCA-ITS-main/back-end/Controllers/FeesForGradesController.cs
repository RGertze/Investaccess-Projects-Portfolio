using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/finances/fees-for-grades")]
public class FeesForGradesController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private FeesForGradesService feesForGradesService;

    public FeesForGradesController(IConfiguration configuration, SCA_ITSContext context, FeesForGradesService feesForGradesService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.feesForGradesService = feesForGradesService;
    }

    #region GET

    //---   GET ALL  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await feesForGradesService.GetAll();
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

    #region EDIT

    //---   EDIT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost]
    public async Task<IActionResult> Edit(EditFeeForGrade details)
    {
        try
        {
            var result = await feesForGradesService.Edit(details);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

}