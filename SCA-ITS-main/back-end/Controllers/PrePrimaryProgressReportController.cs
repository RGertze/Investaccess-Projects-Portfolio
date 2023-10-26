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
[Route("api/pre-primary-progress-reports")]
public class PrePrimaryProgressReportController : ControllerBase
{

    private IConfiguration configuration;
    private PrePrimaryProgressReportsService prePrimaryProgressReportsService;

    public PrePrimaryProgressReportController(IConfiguration configuration, PrePrimaryProgressReportsService prePrimaryProgressReportsService)
    {
        this.configuration = configuration;
        this.prePrimaryProgressReportsService = prePrimaryProgressReportsService;
    }

    #region GET

    /*----   GET ALL PRE PRIMARY PROGRESS REPORTS   ----*/
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet]
    public async Task<IActionResult> GetAllPrePrimaryProgressReports()
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetAllPrePrimaryProgressReports();
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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORTS BY PROGRESS REPORT   ----*/
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("{id}/students")]
    public async Task<IActionResult> GetStudentPrePrimaryProgressReportsByProgressReport(int id)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetStudentPrePrimaryProgressReportsByProgressReport(id);
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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORTS   ----*/
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("students/{studentNumber}")]
    public async Task<IActionResult> GetStudentPrePrimaryProgressReports(string studentNumber)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetStudentPrePrimaryProgressReports(studentNumber);
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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORT   ----*/
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudentPrePrimaryProgressReport(int id)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetStudentPrePrimaryProgressReport(id);
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

    /*----   GET STUDENT PRE PRIMARY PROGRESS REPORT BY REPORT ID   ----*/
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("by-report/{reportId}")]
    public async Task<IActionResult> GetStudentPrePrimaryProgressReportByReportId(int reportId)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetStudentPrePrimaryProgressReportByReportId(reportId);
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

    //---   GET ALL DEVELOPMENT GROUPS  ---
    [HttpGet("development-groups")]
    public async Task<IActionResult> GetAllDevelopmentGroups()
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetAllDevelopmentGroups();
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

    //---   GET ALL DEVELOPMENT CATEGORIES  ---
    [HttpGet("development-categories")]
    public async Task<IActionResult> GetAllDevelopmentCategories()
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetAllDevelopmentCategories();
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

    //---   GET ALL DEVELOPMENT ASSESSMENTS  ---
    [HttpGet("development-assessments")]
    public async Task<IActionResult> GetAllDevelopmentAssessments()
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetAllDevelopmentAssessments();
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

    //---   GET DEVELOPMENT ASSESSMENT GRADES FOR PROGRESS REPORT  ---
    [HttpGet("development-assessment-grades/{studentProgressReportId}")]
    public async Task<IActionResult> GetDevelopmentAssessmentGradesForProgressReport(int studentProgressReportId)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.GetDevelopmentAssessmentGradesForProgressReport(studentProgressReportId);
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

    #endregion

    #region ADD / EDIT

    /*----  ADD   ----*/
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("add")]
    public async Task<IActionResult> Add(AddPrePrimaryProgressReport details)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.Add(details);
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

    //---   EDIT   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> Edit(EditPrePrimaryProgressReport details)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.Edit(details);
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

    //---   EDIT DEVELOPMENT ASSESSMENT GRADE  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpPost("grade/edit")]
    public async Task<IActionResult> EditDevelopmentAssessmentGrade(EditReportGrade details)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.EditDevelopmentAssessmentGrade(details);
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

    /*----   DELETE   ----*/
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await prePrimaryProgressReportsService.Delete(id);
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

}