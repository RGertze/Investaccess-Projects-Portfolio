using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private CoursesService coursesService;
    private StudentProgressReportService studentProgressReportService;
    private StudentReportService studentReportService;

    public CoursesController(IConfiguration configuration, SCA_ITSContext context, StudentProgressReportService studentProgressReportService, StudentReportService studentReportService, CoursesService coursesService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.coursesService = coursesService;
        this.studentProgressReportService = studentProgressReportService;
        this.studentReportService = studentReportService;
    }

    //---   GET ALL COURSE TYPES  ---
    /// <summary>Gets all course types.</summary>
    /// <returns>A list of all course types.</returns>
    [HttpGet("course-types/all")]
    public async Task<IActionResult> GetAllCourseTypes()
    {
        try
        {
            var courses = await dbContext.CourseTypes.ToListAsync();

            return Ok(new Response { errorMessage = "", data = courses });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET COURSE  ---
    /// <summary>Gets a course by its ID.</summary>
    /// <param name="courseId">The ID of the course.</param>
    /// <returns>The course with the specified ID.</returns>
    [HttpGet("{courseId}")]
    public async Task<IActionResult> GetCourse(string courseId)
    {
        try
        {
            var course = await dbContext.Courses.Where(u => u.Id == courseId).FirstOrDefaultAsync();

            if (course is null)
                return NotFound(new Response { errorMessage = "Course not found", data = "" });

            return Ok(new Response { errorMessage = "", data = course });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL COURSES  ---
    /// <summary>Retrieves all courses.</summary>
    /// <returns>All courses.</returns>
    /// <exception cref="Exception">Thrown when an exception occurred.</exception>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllCourses()
    {
        try
        {
            var result = await coursesService.GetAll();
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

    //---   GET ALL COURSES FOR STAFF  ---
    /// <summary>Retrieves all courses for a staff member.</summary>
    /// <param name="staffId">The staff member's ID.</param>
    /// <returns>A list of courses.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("all/staff/{staffId}")]
    public async Task<IActionResult> GetAllCoursesForStaff(int staffId)
    {
        try
        {
            var courses = await (
                from c in dbContext.Courses
                join cs in dbContext.CourseStaffs on c.Id equals cs.CourseId
                where cs.StaffId == staffId
                select c
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = courses });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL COURSES FOR STUDENT  ---
    /// <summary>Retrieves all courses for a student.</summary>
    /// <param name="studentNumber">The student's student number.</param>
    /// <returns>A list of courses.</returns>
    [Authorize(Policy = Policies.REQUIRE_ANY_ROLE)]
    [HttpGet("all/students/{studentNumber}")]
    public async Task<IActionResult> GetAllCoursesForStudent(string studentNumber)
    {
        try
        {
            var courses = await (
                from c in dbContext.Courses
                join cs in dbContext.CourseStudents on c.Id equals cs.CourseId
                where cs.StudentNumber == studentNumber
                select c
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = courses });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   ADD COURSE   ---
    /// <summary>Adds a course to the database.</summary>
    /// <param name="details">The details of the course to add.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost]
    public async Task<IActionResult> AddCourse(AddEditCourseRequest details)
    {
        try
        {
            var result = await coursesService.Add(details, true);
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

    //---   EDIT COURSE   ---
    /// <summary>Edits a course.</summary>
    /// <param name="details">The details of the course to edit.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> EditCourse(AddEditCourseRequest details)
    {
        try
        {
            var result = await coursesService.Edit(details, true);
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

    //---   DELETE COURSE  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("{courseId}")]
    public async Task<IActionResult> DeleteCourse(string courseId)
    {
        try
        {
            var result = await coursesService.Delete(courseId, true);
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



    //---   GET ALL COURSE STAFF  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("staff/{courseId}")]
    public async Task<IActionResult> GetAllCourseStaff(string courseId)
    {
        try
        {
            var courseStaff = await (
                from cs in dbContext.CourseStaffs
                join u in dbContext.UserAccounts on cs.StaffId equals u.UserId
                where cs.CourseId == courseId
                select new
                {
                    cs.CourseId,
                    cs.StaffId,
                    u.Email,
                    u.FirstName,
                    u.LastName
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = courseStaff });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   ADD COURSE STAFF   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("staff")]
    public async Task<IActionResult> AddCourseStaff(AddCourseStaff details)
    {
        try
        {
            var result = await coursesService.AddStaff(details, true);
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

    //---   DELETE COURSE STAFF  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("staff/delete")]
    public async Task<IActionResult> DeleteCourseStaff([FromQuery] string courseId, [FromQuery] int staffId)
    {
        try
        {
            var result = await coursesService.DeleteStaff(courseId, staffId, true);
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

    //---   GET ALL COURSE STUDENTS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("students/{courseId}")]
    public async Task<IActionResult> GetAllCourseStudent(string courseId)
    {
        try
        {
            var courseStudent = await (
                from cs in dbContext.CourseStudents
                join s in dbContext.Students on cs.StudentNumber equals s.StudentNumber
                where cs.CourseId == courseId
                select new
                {
                    cs.CourseId,
                    cs.StudentNumber,
                    s.FirstName,
                    s.LastName
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = courseStudent });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   ADD COURSE STUDENT   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("students")]
    public async Task<IActionResult> AddCourseStudent(AddCourseStudent details)
    {
        try
        {
            var result = await coursesService.AddStudent(details, true);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   DELETE COURSE STUDENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("students/delete")]
    public async Task<IActionResult> DeleteCourseStudent([FromQuery] string courseId, [FromQuery] string studentNumber)
    {
        try
        {
            var result = await coursesService.DeleteStudent(courseId, studentNumber, true);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, ex.Message);
        }
    }

    //---   GET ALL COURSE PROGRESS REPORTS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_OR_STAFF_ROLE)]
    [HttpGet("progress-reports/{courseId}")]
    public async Task<IActionResult> GetAllCourseProgressReport(string courseId)
    {
        try
        {
            var courseProgressReports = await (
                from cpr in dbContext.CourseProgressReports
                join pr in dbContext.ProgressReportTemplates on cpr.ProgressReportId equals pr.Id
                where cpr.CourseId == courseId
                select new
                {
                    cpr.Id,
                    cpr.CourseId,
                    cpr.Year,
                    cpr.NumberOfTerms,
                    cpr.ProgressReportId,
                    pr.Name,
                    pr.ExamWeight
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = courseProgressReports });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   ADD COURSE PROGRESS REPORT   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("progress-reports")]
    public async Task<IActionResult> AddCourseProgressReport(AddCourseProgressReport details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if course progress report exists
            if (await dbContext.CourseProgressReports.AnyAsync(p => p.CourseId == details.courseId && p.Year == details.year))
            {
                return Conflict(new Response { errorMessage = "A progress report for that year already exists", data = "" });
            }

            // check if course exists
            if (!await dbContext.Courses.AnyAsync(c => c.Id == details.courseId))
            {
                return NotFound(new Response { errorMessage = "Course does not exist", data = "" });
            }

            // check if progress report exists
            if (!await dbContext.ProgressReportTemplates.AnyAsync(r => r.Id == details.progressReportId))
            {
                return NotFound(new Response { errorMessage = "Progress report not found", data = "" });
            }

            // create new course progress report
            var courseProgressReport = new CourseProgressReport()
            {
                CourseId = details.courseId,
                ProgressReportId = (int)details.progressReportId,
                NumberOfTerms = (int)details.numberOfTerms,
                Year = (short)details.year
            };

            // store in db
            await dbContext.CourseProgressReports.AddAsync(courseProgressReport);
            await dbContext.SaveChangesAsync();

            // add progress report for students in course
            var result = await studentProgressReportService.AddProgressReportForAllStudentsOfCourse(courseProgressReport);

            // if an error occured delete progress report and throw exception
            if (result.errorMessage.Length > 0)
            {
                dbContext.CourseProgressReports.Remove(courseProgressReport);
                await dbContext.SaveChangesAsync();
                throw new Exception("Failed to add student progress reports");
            }

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   DELETE COURSE PROGRESS REPORT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("progress-reports/delete/{id}")]
    public async Task<IActionResult> DeleteCourseProgressReport(int id)
    {
        try
        {
            var courseProgressReport = await dbContext.CourseProgressReports.Where(cpr => cpr.Id == id).FirstOrDefaultAsync();
            if (courseProgressReport is null)
            {
                return NotFound(new Response { errorMessage = "Record not found", data = "" });
            }

            dbContext.CourseProgressReports.Remove(courseProgressReport);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }
}