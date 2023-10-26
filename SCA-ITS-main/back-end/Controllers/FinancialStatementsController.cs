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
[Route("api/finances/statements")]
public class FinancialStatementsController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private FinancialStatementService financialStatementService;

    public FinancialStatementsController(IConfiguration configuration, SCA_ITSContext context, FinancialStatementService financialStatementService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.financialStatementService = financialStatementService;
    }

    #region GET

    //---   GET PARENT STATEMENT  ---
    [HttpGet("{parentId}")]
    public async Task<IActionResult> Get(int parentId)
    {
        try
        {
            var result = await financialStatementService.GetStatementForParent(parentId);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }
            var currentBalance = ((ParentFinancialStatement)result.data).CurrentBalance;

            result = await financialStatementService.GetStatementItemsForParent(parentId);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            var statement = new
            {
                currentBalance = currentBalance,
                items = result.data
            };

            return Ok(new Response { errorMessage = "", data = statement });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   GET PARENT STATEMENT AS PDF  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpGet("{parentId}/pdf")]
    public async Task<IActionResult> GetAsPdf(int parentId)
    {
        try
        {
            var result = await financialStatementService.GetStatementForParentAsPdf(parentId);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            return File(result.data, "application/pdf", "SCA-financial-statement.pdf");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   GET PARENT BALANCES  ---
    [HttpGet("balances")]
    public async Task<IActionResult> GetBalances()
    {
        try
        {
            var result = await financialStatementService.GetParentBalances();
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
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

    //---   ADD STATEMENT ITEM  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost]
    public async Task<IActionResult> Add(AddStatementItem details)
    {
        try
        {
            var result = await financialStatementService.AddStatementItem(details);
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

    //---   CHARGE PARENTS MONTHLY FEES  ---
    [AllowAnonymous]
    [HttpPost("charge-monthly-fees")]
    public async Task<IActionResult> ChargeParentsMonthlyFees(ChargeParentsMonthlyFeesRequest details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(new Response { errorMessage = "Empty values", data = "" });
        }
        try
        {
            // check for valid token
            if (!details.token.Equals(configuration["AWS_LAMBDA:Token"]))
                return StatusCode(403, new Response { errorMessage = "Empty values", data = "" });

            var result = await financialStatementService.ChargeAllParentsMonthlyFees();
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