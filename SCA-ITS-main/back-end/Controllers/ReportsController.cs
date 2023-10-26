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
[Route("api/[Controller]")]
public class ReportsController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private StudentReportService studentReportService;
    private ReportGenerationService reportGenerationService;
    private IReportGroupService reportGroupService;

    public ReportsController(IConfiguration configuration, SCA_ITSContext context, StudentReportService studentReportService, ReportGenerationService reportGenerationService, IReportGroupService reportGroupService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.studentReportService = studentReportService;
        this.reportGenerationService = reportGenerationService;
        this.reportGroupService = reportGroupService;
    }

    #region Report groups

    //---   GET ALL REPORT GROUPS  ---
    [HttpGet("groups")]
    public async Task<IActionResult> GetAllReportGroups()
    {
        try
        {
            var reportGroups = await dbContext.ReportGroups.Select(rg => new
            {
                rg.Id,
                rg.Year,
                rg.Terms
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = reportGroups });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   ADD REPORT GROUP  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("groups")]
    public async Task<IActionResult> AddGroup(AddReportGroup details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }
        try
        {
            // check for existing report groups
            if (await dbContext.ReportGroups.AnyAsync(rg => rg.Year == details.year))
            {
                return Conflict(new Response { errorMessage = "Already exists", data = "" });
            }

            // create new report group 
            var reportGroup = new ReportGroup()
            {
                Year = (short)details.year,
                Terms = (int)details.terms
            };

            // save to database
            await dbContext.ReportGroups.AddAsync(reportGroup);
            await dbContext.SaveChangesAsync();

            // generate empty student report records
            var result = await studentReportService.AddReportsForAllPrimaryStudents(reportGroup.Id, reportGroup.Terms);
            var result2 = await studentReportService.AddReportsForAllPrePrimaryStudents(reportGroup.Id, reportGroup.Terms);
            if (result.errorMessage.Length > 0 || result2.errorMessage.Length > 0)
            {
                // delete report group
                dbContext.ReportGroups.Remove(reportGroup);
                await dbContext.SaveChangesAsync();

                return StatusCode(500, new Response { errorMessage = "Error occurred while generating records", data = "" });
            }

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   DELETE REPORT GROUP  ---
    [HttpDelete("groups/{id}")]
    public async Task<IActionResult> DeleteReportGroup(int id)
    {
        try
        {
            var result = await reportGroupService.Delete(id);
            if (!String.IsNullOrEmpty(result.errorMessage))
                return StatusCode(result.data, result);

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    #endregion

    #region reports

    //---   GET REPORTS  ---
    [HttpGet("{reportGroupId}")]
    public async Task<IActionResult> GetReports(int reportGroupId, [FromQuery] SearchReports details)
    {
        try
        {
            if (details.staffId is not null)
            {
                var reports = await (
                    from report in dbContext.Reports
                    join student in dbContext.Students on report.StudentNumber equals student.StudentNumber
                    where student.Grade == (details.grade ?? student.Grade)
                    && student.FirstName.ToLower().Contains((details.firstName ?? student.FirstName).ToLower())
                    && student.LastName.ToLower().Contains((details.lastName ?? student.LastName).ToLower())
                    && report.ReportGroupId == reportGroupId
                    && dbContext.CourseStaffs.Where(cs => cs.StaffId == details.staffId).Any(cs => dbContext.CourseStudents.Where(cst => cst.CourseId == cs.CourseId).Any(cst => cst.StudentNumber == student.StudentNumber))
                    && student.RegistrationStage == (int)STUDENT_REGISTRATION_STATUS.APPROVED
                    select new
                    {
                        student.StudentNumber,
                        student.FirstName,
                        student.LastName,
                        student.Grade,

                        reportdId = report.Id
                    }
                ).ToListAsync();

                return Ok(new Response { errorMessage = "", data = reports });
            }
            else
            {
                var reports = await (
                    from report in dbContext.Reports
                    join student in dbContext.Students on report.StudentNumber equals student.StudentNumber
                    where student.Grade == (details.grade ?? student.Grade)
                    && student.FirstName.ToLower().Contains((details.firstName ?? student.FirstName).ToLower())
                    && student.LastName.ToLower().Contains((details.lastName ?? student.LastName).ToLower())
                    && report.ReportGroupId == reportGroupId
                    && student.RegistrationStage == (int)STUDENT_REGISTRATION_STATUS.APPROVED
                    select new
                    {
                        student.StudentNumber,
                        student.FirstName,
                        student.LastName,
                        student.Grade,

                        reportdId = report.Id
                    }
                ).ToListAsync();

                return Ok(new Response { errorMessage = "", data = reports });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL REPORTS FOR STUDENT   ---
    [HttpGet("students/{studentNumber}/generated/")]
    public async Task<IActionResult> GetAllReportsForStudent(string studentNumber)
    {
        try
        {
            var generatedReports = await (
            from grf in dbContext.GeneratedReportFiles
            join job in dbContext.ReportGenerationJobs on grf.JobId equals job.Id
            join rg in dbContext.ReportGroups on job.ReportGroupId equals rg.Id
            join r in dbContext.Reports on grf.ReportId equals r.Id
            join student in dbContext.Students on r.StudentNumber equals student.StudentNumber
            where r.StudentNumber == studentNumber
            && grf.Status == (int)FileStatus.SUCCESSFUL
            select new
            {
                grf.Id,
                grf.Status,
                grf.FilePath,
                rg.Year,
                job.Term
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = generatedReports });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET REPORT DETAILS  ---
    [HttpGet("details/{reportId}")]
    public async Task<IActionResult> GetReportDetails(int reportId)
    {
        try
        {
            var primary = await dbContext.PrimaryReportDetails.Where(rd => rd.ReportId == reportId).FirstOrDefaultAsync();
            var prePrimary = await dbContext.PrePrimaryReportDetails.Where(rd => rd.ReportId == reportId).FirstOrDefaultAsync();

            if (primary is not null)
            {
                return Ok(new Response { errorMessage = "", data = primary });
            }

            if (prePrimary is not null)
            {
                return Ok(new Response { errorMessage = "", data = prePrimary });
            }

            return NotFound(new Response { errorMessage = "Not found", data = "" });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   EDIT REPORT DETAILS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpPost("details")]
    public async Task<IActionResult> EditReportDetails(EditReportDetails details)
    {
        if (details.id is null)
        {
            return BadRequest(new Response { errorMessage = "Id is null", data = "" });
        }
        try
        {
            // get report
            var report = await dbContext.Reports.FirstOrDefaultAsync(r => r.Id == details.id);
            if (report is null)
            {
                return NotFound(new Response { errorMessage = "report not found", data = "" });
            }


            // get student
            var student = await dbContext.Students.FirstOrDefaultAsync(s => s.StudentNumber == report.StudentNumber);
            if (student is null)
            {
                return NotFound(new Response { errorMessage = "student not found", data = "" });
            }


            if (student.Grade == 0)
            {
                // get report details
                var reportDetails = await dbContext.PrePrimaryReportDetails.FirstOrDefaultAsync(r => r.ReportId == report.Id);
                if (reportDetails is null)
                {
                    return NotFound(new Response { errorMessage = "report details not found", data = "" });
                }
                Console.WriteLine("heree");

                // edit 
                reportDetails.DaysAbsent = details.daysAbsent ?? reportDetails.DaysAbsent;
                reportDetails.DominantHand = details.dominantHand ?? reportDetails.DominantHand;
                reportDetails.Remarks = details.remarks ?? reportDetails.Remarks;
                reportDetails.RegisterTeacher = details.registerTeacher ?? reportDetails.RegisterTeacher;

                // update database
                dbContext.PrePrimaryReportDetails.Update(reportDetails);
            }
            else
            {
                // get report details
                var reportDetails = await dbContext.PrimaryReportDetails.FirstOrDefaultAsync(r => r.ReportId == report.Id);
                if (reportDetails is null)
                {
                    return NotFound(new Response { errorMessage = "report details not found", data = "" });
                }

                // edit  
                reportDetails.DaysAbsent = details.daysAbsent ?? reportDetails.DaysAbsent;
                reportDetails.PersonaBriefComments = details.personaBriefComments ?? reportDetails.PersonaBriefComments;
                reportDetails.RegisterTeacher = details.registerTeacher ?? reportDetails.RegisterTeacher;

                // update database
                dbContext.PrimaryReportDetails.Update(reportDetails);
            }

            // save to database
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }



    #endregion

    #region Course remarks

    //---   GET COURSE REMARKS FOR REPORT  ---
    [HttpGet("course-remarks/{reportId}")]
    public async Task<IActionResult> GetCourseRemarksForReport(int reportId)
    {
        try
        {
            var courseRemarks = await (
                from courseRemark in dbContext.CourseRemarks
                join course in dbContext.Courses on courseRemark.CourseId equals course.Id
                where courseRemark.ReportId == reportId
                select new
                {
                    courseRemark.Id,
                    courseRemark.Remark,
                    courseRemark.Initials,

                    courseName = course.Name
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = courseRemarks });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   EDIT COURSE REMARK  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpPost("course-remarks")]
    public async Task<IActionResult> EditCourseRemarks(EditCourseRemark details)
    {
        if (details.id is null)
        {
            return BadRequest(new Response { errorMessage = "Id is null", data = "" });
        }
        try
        {
            // get course remark
            var courseRemark = await dbContext.CourseRemarks.FirstOrDefaultAsync(cr => cr.Id == details.id);
            if (courseRemark is null)
            {
                return NotFound(new Response { errorMessage = "Course remark not found", data = "" });
            }

            // edit remark 
            courseRemark.Remark = details.remark ?? courseRemark.Remark;
            courseRemark.Initials = details.initials ?? courseRemark.Initials;

            // save to database
            dbContext.CourseRemarks.Update(courseRemark);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    #endregion

    #region Personas

    //---   GET ALL PERSONA CATEGORIES  ---
    [HttpGet("persona-categories")]
    public async Task<IActionResult> GetAllPersonaCategories()
    {
        try
        {
            var personaCategories = await dbContext.PersonaCategories.Select(pc => new
            {
                pc.Id,
                pc.Name
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = personaCategories });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL PERSONAS  ---
    [HttpGet("personas")]
    public async Task<IActionResult> GetAllPersonas()
    {
        try
        {
            var personaCategories = await dbContext.Personas.Select(p => new
            {
                p.Id,
                categoryId = p.PersonaCategoryId,
                p.Name
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = personaCategories });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET PERSONA GRADES FOR REPORT  ---
    [HttpGet("persona-grades/{reportId}")]
    public async Task<IActionResult> GetPersonaGradesForReport(int reportId)
    {
        try
        {
            var personaGrades = await (
                from personaGrade in dbContext.PersonaGrades
                join persona in dbContext.Personas on personaGrade.PersonaId equals persona.Id
                where personaGrade.ReportId == reportId
                select new
                {
                    personaGrade.Id,
                    personaGrade.Grade,
                    personaGrade.Term,

                    categoryId = persona.PersonaCategoryId,
                    personaName = persona.Name

                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = personaGrades });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   EDIT PERSONA GRADE  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpPost("persona-grades")]
    public async Task<IActionResult> EditPersonaGrade(EditReportGrade details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }
        try
        {
            // get persona grade
            var personaGrade = await dbContext.PersonaGrades.FirstOrDefaultAsync(p => p.Id == details.id);
            if (personaGrade is null)
            {
                return NotFound(new Response { errorMessage = "Persona grade not found", data = "" });
            }

            // check if grade is in range
            List<string> grades = new List<string>() { "E", "G", "S", "N" }; // E – excellent; G – good; S – satisfactory; N – needs Improvement
            if (!grades.Contains(details.grade))
            {
                return BadRequest(new Response { errorMessage = "Invalid grade. Valid grades: E, G, S, N", data = "" });
            }

            // edit grade 
            personaGrade.Grade = details.grade;

            // save to database
            dbContext.PersonaGrades.Update(personaGrade);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    #endregion

    #region Report generation

    //---   GET REPORT GENERATION JOBS FOR REPORT GROUP  ---
    [HttpGet("generate/{reportGroupId}")]
    public async Task<IActionResult> GetReportGenerationJobs(int reportGroupId)
    {
        try
        {
            var generationJobs = await dbContext.ReportGenerationJobs.Where(rgj => rgj.ReportGroupId == reportGroupId).Select(rgj => new
            {
                rgj.Id,
                rgj.ReportGroupId,
                rgj.Term,
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = generationJobs });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET GENERATED REPORTS FOR JOB  ---
    [HttpGet("generate/files/{jobId}")]
    public async Task<IActionResult> GetGeneratedReportsForJob(int jobId)
    {
        try
        {
            var generatedReports = await (
            from grf in dbContext.GeneratedReportFiles
            join r in dbContext.Reports on grf.ReportId equals r.Id
            join student in dbContext.Students on r.StudentNumber equals student.StudentNumber
            where grf.JobId == jobId
            select new
            {
                grf.Id,
                grf.Status,
                grf.FailureMessage,
                grf.FilePath,

                student.StudentNumber,
                student.FirstName,
                student.LastName,
                student.Grade
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = generatedReports });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }


    //---   ADD REPORT GENERATION JOB  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("generate")]
    public async Task<IActionResult> AddReportGenerationJob(AddGenerationJob details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }
        try
        {
            // get report group
            var reportGroup = await dbContext.ReportGroups.FirstOrDefaultAsync(rg => rg.Id == details.reportGroupId);
            if (reportGroup is null)
            {
                return NotFound(new Response { errorMessage = "Report group not found", data = "" });
            }

            // check if term is in range
            if (details.term < 1 || details.term > reportGroup.Terms)
            {
                return BadRequest(new Response { errorMessage = $"Invalid term. Must be between 1 and {reportGroup.Terms}", data = "" });
            }

            // check if generation job for term already exists
            if (await dbContext.ReportGenerationJobs.AnyAsync(rgj => rgj.ReportGroupId == reportGroup.Id && rgj.Term == details.term))
            {
                return Conflict(new Response { errorMessage = "A generation job already exists for the term provided", data = "" });
            }

            // create record
            var result = await studentReportService.CreateReportGenerationJobRecords(reportGroup, (int)details.term, details.schoolReOpens);
            if (result.errorMessage.Length > 0)
            {
                return StatusCode(500, result);
            }

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Server error, try again later", data = "" });
        }
    }

    //---   DELETE REPORT GENERATION JOB  ---
    [HttpDelete("generate/{id}")]
    public async Task<IActionResult> DeleteReportGenerationJob(int id)
    {
        try
        {
            var result = await reportGenerationService.DeleteJob(id);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   RERUN ALL FILES  ---
    [HttpGet("generate/re-run/all/{id}")]
    public async Task<IActionResult> RerunAllFiles(int id)
    {
        try
        {
            var result = await reportGenerationService.RerunAllFiles(id);
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

    //---   RERUN SINGLE FILE  ---
    [HttpGet("generate/re-run/{id}")]
    public async Task<IActionResult> RerunSingleFile(int id)
    {
        try
        {
            var result = await reportGenerationService.RerunSingleFile(id);
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



    #endregion
}