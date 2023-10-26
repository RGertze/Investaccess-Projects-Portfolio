using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private StudentReportService studentReportService;
    private StudentService studentService;

    public StudentController(IConfiguration configuration, SCA_ITSContext context, StudentReportService studentReportService, StudentService studentService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.studentReportService = studentReportService;
        this.studentService = studentService;
    }

    #region GET

    //---   GET STUDENT  ---
    [HttpGet("{studentNumber}")]
    public async Task<IActionResult> GetStudent(string studentNumber)
    {
        try
        {
            var result = await studentService.GetOne(studentNumber);
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

    //---   GET ALL STUDENTS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("all")]
    public async Task<IActionResult> GetAll([FromQuery] StudentSearchParams searchParams)
    {
        try
        {
            var result = await studentService.GetAll(searchParams);
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

    //---   GET ALL STUDENTS FOR PARENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpGet("parent/all/{parentId}")]
    public async Task<IActionResult> GetAllForParent(int parentId)
    {
        try
        {
            var result = await studentService.GetAllForParent(parentId);
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

    //---   GET ALL STUDENTS FOR STAFF  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("staff/all/{staffId}")]
    public async Task<IActionResult> GetAllForStaff(int staffId)
    {
        try
        {
            var result = await studentService.GetAllForStaff(staffId);
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
            return StatusCode(500);
        }
    }

    #endregion

    //---   EDIT STUDENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> EditStudent(EditStudentRequest details)
    {
        try
        {
            var result = await studentService.Edit(details, true);
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

    //---   BULK EDIT STUDENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("edit/bulk")]
    public async Task<IActionResult> BulkEditStudent(List<EditStudentRequest> details)
    {
        try
        {
            var result = await studentService.BulkEdit(details, true);
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



    //---   PARENT ADD STUDENT   ---
    [Authorize(Policy = Policies.REQUIRE_PARENT_ROLE)]
    [HttpPost("add")]
    public async Task<IActionResult> ParentAddStudent(AddStudentRequest details)
    {
        try
        {
            var result = await studentService.Add(details, false);
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

    //---   ADMIN ADD STUDENT   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("admin/add")]
    public async Task<IActionResult> AdminAddStudent(AddStudentRequest details)
    {
        try
        {
            var result = await studentService.Add(details, true);
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

    //---   DELETE STUDENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_PARENT_ROLE)]
    [HttpDelete("{studentNumber}")]
    public async Task<IActionResult> Delete(string studentNumber)
    {
        try
        {
            var result = await studentService.Delete(studentNumber, true);
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
            return StatusCode(500, ex.Message);
        }
    }

    #region PROGRESS REPORT STUFF

    //---   GET STUDENT PROGRESS REPORTS  ---
    [HttpGet("progress-reports/{studentNumber}")]
    public async Task<IActionResult> GetStudentProgressReports(string studentNumber)
    {
        try
        {
            var progressReports = await (
                from spr in dbContext.StudentProgressReports
                join cpr in dbContext.CourseProgressReports on spr.CourseProgressReportId equals cpr.Id
                join pr in dbContext.ProgressReportTemplates on cpr.ProgressReportId equals pr.Id
                where spr.StudentNumber == studentNumber
                select new
                {
                    progressReportId = pr.Id,
                    progressReporName = pr.Name,

                    courseProgressReportId = cpr.Id,
                    cpr.CourseId,
                    cpr.NumberOfTerms,
                    cpr.Year
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = progressReports });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET STUDENT PROGRESS REPORTS FOR STAFF  ---
    [HttpGet("progress-reports/{studentNumber}/{staffId}")]
    public async Task<IActionResult> GetStudentProgressReports(string studentNumber, int staffId)
    {
        try
        {
            var progressReports = await (
                from spr in dbContext.StudentProgressReports
                join cpr in dbContext.CourseProgressReports on spr.CourseProgressReportId equals cpr.Id
                join pr in dbContext.ProgressReportTemplates on cpr.ProgressReportId equals pr.Id
                where spr.StudentNumber == studentNumber && dbContext.CourseStaffs.Any(cs => cs.CourseId == cpr.CourseId && cs.StaffId == staffId)
                select new
                {
                    progressReportId = pr.Id,
                    progressReporName = pr.Name,

                    courseProgressReportId = cpr.Id,
                    cpr.CourseId,
                    cpr.NumberOfTerms,
                    cpr.Year
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = progressReports });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET STUDENT PROGRESS REPORT ASSESSMENTS BY CATEGORY  ---
    [HttpGet("progress-reports/assessments")]
    public async Task<IActionResult> GetStudentProgressReportAssessmentsByCategory([FromQuery] string studentNumber, [FromQuery] int categoryId, [FromQuery] int courseReportId)
    {
        try
        {
            var assessments = await (
                from sa in dbContext.StudentProgressReportAssessments
                join sp in dbContext.StudentProgressReports on sa.StudentProgressReportId equals sp.Id
                join pa in dbContext.ProgressReportAssessments on sa.ProgressReportAssessmentId equals pa.Id
                join pc in dbContext.ProgressReportCategories on pa.ProgressReportCategoryId equals pc.Id
                where sp.StudentNumber == studentNumber && pc.Id == categoryId && sp.CourseProgressReportId == courseReportId
                select new
                {
                    progressReportAssessmentId = pa.Id,
                    pa.MarksAvailable,
                    sa.Id,
                    pa.Name,
                    sa.Mark,
                    sa.Term
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = assessments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   UPDATE STUDENT ASSESSMENT MARK   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpPost("progress-reports/assessments/update")]
    public async Task<IActionResult> UpdateStudentAssessmentMark(UpdateStudentAssessmentMark details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if report assessment exists
            var reportAssessment = await dbContext.ProgressReportAssessments.FirstOrDefaultAsync(a => a.Id == details.reportAssessmentId);
            if (reportAssessment is null)
            {
                return NotFound(new Response { errorMessage = "report assessment not found", data = "" });
            }

            // check student assessment exists
            var studentAssessment = await dbContext.StudentProgressReportAssessments.FirstOrDefaultAsync(a => a.Id == details.studentAssessmentId);
            if (studentAssessment is null)
            {
                return NotFound(new Response { errorMessage = "student assessment not found", data = "" });
            }

            // check if mark out of range
            if (details.mark < 0 || details.mark > reportAssessment.MarksAvailable)
            {
                return BadRequest(new Response { errorMessage = $"Mark should be between 0 and {reportAssessment.MarksAvailable}", data = "" });
            }

            // update and save
            studentAssessment.Mark = (decimal)details.mark;
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   UPDATE STUDENT EXAM MARK   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpPost("progress-reports/exam/update")]
    public async Task<IActionResult> UpdateStudentExamMark(UpdateStudentExamMark details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check student assessment exists
            var examMark = await dbContext.StudentProgressReportExamMarks.FirstOrDefaultAsync(a => a.Id == details.id);
            if (examMark is null)
            {
                return NotFound(new Response { errorMessage = "record not found", data = "" });
            }

            // get progress report
            var progressReport = await (
                from p in dbContext.ProgressReportTemplates
                join cpr in dbContext.CourseProgressReports on p.Id equals cpr.ProgressReportId
                join sp in dbContext.StudentProgressReports on cpr.Id equals sp.CourseProgressReportId
                select new
                {
                    p.ExamMarksAvailable,
                    sp.Id
                }
            ).FirstAsync(p => p.Id == examMark.StudentProgressReportId);

            // check if mark out of range
            if (details.mark < 0 || details.mark > progressReport.ExamMarksAvailable)
            {
                return BadRequest(new Response { errorMessage = $"Mark should be between 0 and {progressReport.ExamMarksAvailable}", data = "" });
            }

            // update and save
            examMark.Mark = (decimal)details.mark;
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
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