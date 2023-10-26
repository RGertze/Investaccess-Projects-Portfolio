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
[Route("api/other-parents")]
public class OtherParentsController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private OtherParentsService otherParentsService;

    public OtherParentsController(IConfiguration configuration, SCA_ITSContext context, OtherParentsService otherParentsService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.otherParentsService = otherParentsService;
    }

    #region GET

    //---   GET ALL FOR PARENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAllForStudent(int id)
    {
        try
        {
            var result = await otherParentsService.GetAllForParent(id);
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

    #region ADD

    //---   ADD  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpPost]
    public async Task<IActionResult> Add(AddOtherParent details)
    {
        try
        {
            var result = await otherParentsService.Add(details);
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

    #region EDIT

    //---   EDIT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> Edit(EditOtherParent details)
    {
        try
        {
            var result = await otherParentsService.Edit(details);
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

    #region DELETE

    //---   DELETE  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await otherParentsService.Delete(id);
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
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

}