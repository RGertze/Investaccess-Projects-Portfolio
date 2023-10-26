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
[Route("api/student-medical-conditions")]
public class StudentMedicalConditionsController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private StudentMedicalConditionsService studentMedicalConditionsService;

    public StudentMedicalConditionsController(IConfiguration configuration, SCA_ITSContext context, StudentMedicalConditionsService studentMedicalConditionsService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.studentMedicalConditionsService = studentMedicalConditionsService;
    }

    #region GET

    //---   GET ALL FOR STUDENT ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpGet("{studentNumber}")]
    public async Task<IActionResult> GetAllForStudent(string studentNumber)
    {
        try
        {
            var result = await studentMedicalConditionsService.GetAllForStudent(studentNumber);
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
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpPost]
    public async Task<IActionResult> Edit(EditStudentMedicalCondition details)
    {
        try
        {
            var result = await studentMedicalConditionsService.EditStudentMedicalConditions(details);
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