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
[Route("api/medical-conditions")]
public class MedicalConditionsController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private MedicalConditionsService medicalConditionsService;

    public MedicalConditionsController(IConfiguration configuration, SCA_ITSContext context, MedicalConditionsService medicalConditionsService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.medicalConditionsService = medicalConditionsService;
    }

    #region GET

    //---   GET ALL  ---
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await medicalConditionsService.GetAll();
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

    #endregion

}