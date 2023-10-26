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
[Route("api/finances/proof-of-deposit")]
public class FinancialProofOfDepositController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private FinancialStatementService financialStatementService;

    public FinancialProofOfDepositController(IConfiguration configuration, SCA_ITSContext context, FinancialStatementService financialStatementService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.financialStatementService = financialStatementService;
    }

    #region Get

    //---   GET PROOF OF DEPOSITS  ---
    [HttpGet("{parentId}")]
    public async Task<IActionResult> Get(int parentId)
    {
        try
        {
            var result = await financialStatementService.GetProofOfDepositsForParent(parentId);

            return Ok(new Response { errorMessage = "", data = result.data });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   GET PENDING PROOF OF DEPOSITS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        try
        {
            var result = await financialStatementService.getPendingProofOfDeposits();

            return Ok(new Response { errorMessage = "", data = result.data });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

    #region Add

    //---   ADD PROOF OF DEPOSIT  ---
    [Authorize(Policy = Policies.REQUIRE_PARENT_ROLE)]
    [HttpPost]
    public async Task<IActionResult> Add(AddProofOfDeposit details)
    {
        try
        {
            var result = await financialStatementService.AddProofOfDeposit(details);
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

    #region Edit

    //---   EDIT PROOF OF DEPOSIT   ---
    [Authorize(Policy = Policies.REQUIRE_PARENT_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> EditStatus(EditProofOfDeposit details)
    {
        try
        {
            var result = await financialStatementService.EditProofOfDeposit(details);
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

    //---   EDIT PROOF OF DEPOSIT STATUS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("status/edit")]
    public async Task<IActionResult> EditStatus(EditProofOfDepositStatusRequest details)
    {
        try
        {
            var result = await financialStatementService.EditProofOfDepositStatus(new EditProofOfDepositStatus { id = details.id, status = details.status }, details.message ?? "");
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

    #region Delete

    //---   DELETE PROOF OF DEPOSITS  ---
    [HttpDelete("{id}")]
    public async Task<IActionResult> delete(int id)
    {
        try
        {
            var result = await financialStatementService.DeleteProofOfDeposit(id);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            return Ok(new Response { errorMessage = "", data = new { message = "ok" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

}