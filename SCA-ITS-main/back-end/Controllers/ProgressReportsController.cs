using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using Microsoft.EntityFrameworkCore.Storage;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/progress-reports")]
public class ProgressReportsController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private StudentProgressReportService studentProgressReportService;

    public ProgressReportsController(IConfiguration configuration, SCA_ITSContext context, StudentProgressReportService studentProgressReportService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.studentProgressReportService = studentProgressReportService;
    }

    //---   GET PROGRESS REPORT  ---
    [HttpGet("{progId}")]
    public async Task<IActionResult> Get(int progId)
    {
        try
        {
            var progressReports = await dbContext.ProgressReportTemplates.Where(p => p.Id == progId).Select(p => new
            {
                p.Id,
                p.Name,
                p.ExamWeight,
                p.ExamMarksAvailable
            }).FirstOrDefaultAsync();

            return Ok(new Response { errorMessage = "", data = progressReports });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL  ---
    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var progressReports = await dbContext.ProgressReportTemplates.Select(p => new
            {
                p.Id,
                p.Name,
                p.ExamMarksAvailable,
                p.ExamWeight
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = progressReports });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL CATEGORIES FOR PROGRESS REPORT  ---
    [HttpGet("categories/all/{progRepId}")]
    public async Task<IActionResult> GetAllCategoriesForProgressReport(int progRepId)
    {
        try
        {
            var progRepCategories = await dbContext.ProgressReportCategories.Where(p => p.ProgressReportId == progRepId).OrderBy(p => p.Id).Select(p => new
            {
                p.Id,
                p.ProgressReportId,
                p.Name,
                p.Weight,
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = progRepCategories });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL ASSESSMENTS FOR CATEGORY  ---
    [HttpGet("categories/assessments/all/{catId}")]
    public async Task<IActionResult> GetAllAssessmentsForCategory(int catId)
    {
        try
        {
            var assessments = await dbContext.ProgressReportAssessments.Where(p => p.ProgressReportCategoryId == catId).Select(p => new
            {
                p.Id,
                p.ProgressReportCategoryId,
                p.Name,
                p.MarksAvailable
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = assessments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL ASSESSMENTS FOR PROGRESS REPORT  ---
    [HttpGet("categories/assessments/{repId}")]
    public async Task<IActionResult> GetAllAssessmentsForProgressReport(int repId)
    {
        try
        {
            var assessments = await (
            from progRep in dbContext.ProgressReportTemplates
            join category in dbContext.ProgressReportCategories on progRep.Id equals category.ProgressReportId
            join assessment in dbContext.ProgressReportAssessments on category.Id equals assessment.ProgressReportCategoryId
            where progRep.Id == repId
            orderby category.Id
            orderby assessment.Id
            select new
            {
                assessment.Id,
                assessment.ProgressReportCategoryId,
                assessment.Name,
                assessment.MarksAvailable
            }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = assessments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL STUDENT ASSESSMENTS FOR COURSE PROGRESS REPORT  ---
    [HttpGet("categories/assessments/students/{courseReportId}")]
    public async Task<IActionResult> GetAllStudentAssessmentsForCourseProgressReport(int courseReportId)
    {
        try
        {
            var assessments = await (
                from sa in dbContext.StudentProgressReportAssessments
                join sp in dbContext.StudentProgressReports on sa.StudentProgressReportId equals sp.Id
                join pa in dbContext.ProgressReportAssessments on sa.ProgressReportAssessmentId equals pa.Id
                join pc in dbContext.ProgressReportCategories on pa.ProgressReportCategoryId equals pc.Id

                join student in dbContext.Students on sp.StudentNumber equals student.StudentNumber

                where sp.CourseProgressReportId == courseReportId

                orderby pc.Id ascending
                orderby sa.Term ascending
                orderby student.LastName ascending

                select new
                {
                    student.StudentNumber,
                    student.FirstName,
                    student.LastName,

                    categoryId = pc.Id,

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
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET ALL EXAM MARKS FOR COURSE PROGRESS REPORT  ---
    [HttpGet("exam/students/{courseRepId}")]
    public async Task<IActionResult> GetAllExamMarksForProgressReport(int courseRepId)
    {
        try
        {
            var examMarks = await (
                from p in dbContext.ProgressReportTemplates
                join cpr in dbContext.CourseProgressReports on p.Id equals cpr.ProgressReportId
                join sp in dbContext.StudentProgressReports on cpr.Id equals sp.CourseProgressReportId
                join student in dbContext.Students on sp.StudentNumber equals student.StudentNumber
                join ex in dbContext.StudentProgressReportExamMarks on sp.Id equals ex.StudentProgressReportId

                where cpr.Id == courseRepId

                orderby student.StudentNumber ascending
                orderby ex.Term ascending
                orderby student.LastName ascending

                select new
                {
                    student.StudentNumber,
                    student.FirstName,
                    student.LastName,

                    p.ExamMarksAvailable,
                    ex.Id,
                    ex.Mark,
                    ex.Term
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = examMarks });

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   ADD PROGRESS REPORT TEMPLATE  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost]
    public async Task<IActionResult> AddProgressReportTemplate(AddProgressReport details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if progress report already exists
            if (await dbContext.ProgressReportTemplates.AnyAsync(p => p.Name == details.name))
            {
                return Conflict(new Response { errorMessage = "A progress report template with that name for that year already exists", data = "" });
            }

            // check if weight in range
            if (details.examWeight < 0 || details.examWeight > 100)
            {
                return BadRequest(new Response { errorMessage = "Exam weight out of range. Must be bewteen 0 and 100", data = "" });
            }

            // create new progress report template
            var pr = new ProgressReportTemplate()
            {
                Name = details.name,
                ExamWeight = (decimal)details.examWeight,
                ExamMarksAvailable = (decimal)details.examMarksAvailable
            };

            // store in db
            await dbContext.ProgressReportTemplates.AddAsync(pr);
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

    //---   ADD PROGRESS REPORT CATEGORY  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("categories")]
    public async Task<IActionResult> AddProgressReportCategory(AddProgressReportCategory details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if progress report exists
            if (!await dbContext.ProgressReportTemplates.AnyAsync(p => p.Id == details.progressReportId))
            {
                return NotFound(new Response { errorMessage = "Progress report not found", data = "" });
            }

            // check if progress report category already exists
            if (await dbContext.ProgressReportCategories.AnyAsync(p => p.Name == details.name && p.ProgressReportId == details.progressReportId))
            {
                return Conflict(new Response { errorMessage = "A progress report category with that name already exists", data = "" });
            }

            // check if weight in range
            if (details.weight < 0 || details.weight > 100)
            {
                return BadRequest(new Response { errorMessage = "Weight out of range. Must be bewteen 0 and 100", data = "" });
            }

            // check if total category weight will be < 100
            var totalWeight = await dbContext.ProgressReportCategories.Where(c => c.ProgressReportId == details.progressReportId).SumAsync(c => (double)c.Weight);
            if (totalWeight + (double)details.weight > 100)
            {
                return Conflict(new Response { errorMessage = $"Total category weight exceeds 100%. Current total weight: {totalWeight}", data = "" });
            }

            // create new progress report category
            var pr = new ProgressReportCategory()
            {
                ProgressReportId = (int)details.progressReportId,
                Name = details.name,
                Weight = (decimal)details.weight
            };

            // store in db
            await dbContext.ProgressReportCategories.AddAsync(pr);
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

    //---   ADD CATEGORY ASSESSMENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("categories/assessments")]
    public async Task<IActionResult> AddCategoryAssessment(AddCategoryAssessment details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if category exists
            var progressReportCategory = await dbContext.ProgressReportCategories.FirstOrDefaultAsync(p => p.Id == details.categoryId);
            if (progressReportCategory is null)
            {
                return NotFound(new Response { errorMessage = "Category not found", data = "" });
            }

            // check if assessment already exists
            if (await dbContext.ProgressReportAssessments.AnyAsync(p => p.Name == details.name && p.ProgressReportCategoryId == details.categoryId))
            {
                return Conflict(new Response { errorMessage = "An assessment with that name already exists", data = "" });
            }

            // create new assessment
            var assessment = new ProgressReportAssessment()
            {
                ProgressReportCategoryId = (int)details.categoryId,
                Name = details.name,
                MarksAvailable = (decimal)details.marksAvailable
            };

            // store in db
            await dbContext.ProgressReportAssessments.AddAsync(assessment);
            await dbContext.SaveChangesAsync();

            // add to existing student progress reports
            var result = await studentProgressReportService.AddProgressReportAssessmentForAllStudents(progressReportCategory.ProgressReportId, assessment);


            // delete assessment and throw error if failed
            if (result.errorMessage.Length > 0)
            {
                dbContext.ProgressReportAssessments.Remove(assessment);
                await dbContext.SaveChangesAsync();
                throw new Exception(result.errorMessage);
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

    //---   DELETE PROGRESS REPORT   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("{progRepId}")]
    public async Task<IActionResult> DeleteProgressReport(int progRepId)
    {
        try
        {
            // get prog rep
            var progRep = await dbContext.ProgressReportTemplates.Where(p => p.Id == progRepId).FirstOrDefaultAsync();

            if (progRep is null)
            {
                return NotFound(new Response { errorMessage = "Category not found", data = "" });
            }

            // delete prog rep
            dbContext.ProgressReportTemplates.Remove(progRep);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   DELETE PROGRESS REPORT CATEGORY  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("categories/{progRepCatId}")]
    public async Task<IActionResult> DeleteProgressReportCategory(int progRepCatId)
    {
        try
        {
            // get category
            var progRepCategory = await dbContext.ProgressReportCategories.Where(p => p.Id == progRepCatId).FirstOrDefaultAsync();

            if (progRepCategory is null)
            {
                return NotFound(new Response { errorMessage = "Category not found", data = "" });
            }

            // delete category
            dbContext.ProgressReportCategories.Remove(progRepCategory);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   DELETE CATEGORY ASSESSMENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("categories/assessments/{assessmentId}")]
    public async Task<IActionResult> DeleteCategoryAssessment(int assessmentId)
    {
        try
        {
            // get assessment
            var assessment = await dbContext.ProgressReportAssessments.Where(p => p.Id == assessmentId).FirstOrDefaultAsync();

            if (assessment is null)
            {
                return NotFound(new Response { errorMessage = "Assessment not found", data = "" });
            }

            // delete assessment
            dbContext.ProgressReportAssessments.Remove(assessment);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   EDIT PROGRESS REPORT TEMPLATE  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> EditProgressReportTemplate(EditProgressReport details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if progress report exists
            var progRep = await dbContext.ProgressReportTemplates.FirstOrDefaultAsync(p => p.Id == details.id);
            if (progRep is null)
            {
                return NotFound(new Response { errorMessage = "Progress report not found", data = "" });
            }

            // check if progress report with new name already exists
            if (await dbContext.ProgressReportTemplates.AnyAsync(p => p.Name == details.name && p.Id != progRep.Id))
            {
                return Conflict(new Response { errorMessage = "A progress report template with that name already exists", data = "" });
            }

            // check if weight in range
            if (details.examWeight < 0 || details.examWeight > 100)
            {
                return BadRequest(new Response { errorMessage = "Exam weight out of range. Must be bewteen 0 and 100", data = "" });
            }

            // create copy of object
            var progRepCopy = new ProgressReportTemplate()
            {
                Name = progRep.Name,
                ExamMarksAvailable = progRep.ExamMarksAvailable,
                ExamWeight = progRep.ExamWeight
            };

            // update progrep values
            progRep.Name = details.name;
            progRep.ExamMarksAvailable = (decimal)details.examMarksAvailable;
            progRep.ExamWeight = (decimal)details.examWeight;

            // save changes
            dbContext.ProgressReportTemplates.Update(progRep);
            await dbContext.SaveChangesAsync();

            // update student progress report exam marks to reflect new changes
            var result = await studentProgressReportService.UpdateProgressReportExamMarksForAllStudents(progRep.Id, progRepCopy.ExamMarksAvailable, progRep.ExamMarksAvailable);

            // revert changes if error occurred
            if (result.errorMessage.Length > 0)
            {
                progRep.Name = progRepCopy.Name;
                progRep.ExamMarksAvailable = progRepCopy.ExamMarksAvailable;
                progRep.ExamWeight = progRepCopy.ExamWeight;

                dbContext.ProgressReportTemplates.Update(progRep);
                await dbContext.SaveChangesAsync();

                return StatusCode(500, result);
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

    //---   EDIT PROGRESS REPORT CATEGORY  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("categories/edit")]
    public async Task<IActionResult> EditProgressReportCategory(EditCategory details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if category exists
            var category = await dbContext.ProgressReportCategories.FirstOrDefaultAsync(p => p.Id == details.id);
            if (category is null)
            {
                return NotFound(new Response { errorMessage = "Category not found", data = "" });
            }

            // check if category with new name already exists
            if (await dbContext.ProgressReportCategories.AnyAsync(p => p.Name == details.name && p.Id != category.Id))
            {
                return Conflict(new Response { errorMessage = "A category with that name already exists", data = "" });
            }

            // check if weight in range
            if (details.weight < 0 || details.weight > 100)
            {
                return BadRequest(new Response { errorMessage = "Exam weight out of range. Must be bewteen 0 and 100", data = "" });
            }

            // check if total category weight will be < 100
            var totalWeight = await dbContext.ProgressReportCategories.Where(c => c.ProgressReportId == category.ProgressReportId && c.Id != category.Id).SumAsync(c => (double)c.Weight);
            if (totalWeight + (double)details.weight > 100)
            {
                return Conflict(new Response { errorMessage = $"Total category weight exceeds 100%. Current total weight: {totalWeight}", data = "" });
            }

            // update progrep values
            category.Name = details.name;
            category.Weight = (decimal)details.weight;

            // save changes
            dbContext.ProgressReportCategories.Update(category);
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

    //---   EDIT PROGRESS REPORT ASSESSMENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("categories/assessments/edit")]
    public async Task<IActionResult> EditProgressReportAssessment(EditAssessment details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // check if assessment exists
            var assessment = await dbContext.ProgressReportAssessments.FirstOrDefaultAsync(p => p.Id == details.id);
            if (assessment is null)
            {
                return NotFound(new Response { errorMessage = "Assessment not found", data = "" });
            }

            // check if assessment with new name already exists
            if (await dbContext.ProgressReportAssessments.AnyAsync(p => p.Name == details.name && p.Id != assessment.Id))
            {
                return Conflict(new Response { errorMessage = "An assessment with that name already exists", data = "" });
            }

            // check if marks in range
            if (details.marksAvailable < 0)
            {
                return BadRequest(new Response { errorMessage = "Available marks out of range. Must be greater than 0", data = "" });
            }

            // create copy of object
            var assessmentCopy = new ProgressReportAssessment()
            {
                Name = assessment.Name,
                MarksAvailable = assessment.MarksAvailable
            };

            // update progrep values
            assessment.Name = details.name;
            assessment.MarksAvailable = (decimal)details.marksAvailable;

            // save changes
            dbContext.ProgressReportAssessments.Update(assessment);
            await dbContext.SaveChangesAsync();

            // update student progress report assessment marks to reflect new changes
            var result = await studentProgressReportService.UpdateProgressReportAssessmentMarksForAllStudents(assessment.Id, assessmentCopy.MarksAvailable, assessment.MarksAvailable);

            // revert changes if error occurred
            if (result.errorMessage.Length > 0)
            {
                assessment.Name = assessmentCopy.Name;
                assessment.MarksAvailable = assessmentCopy.MarksAvailable;

                dbContext.ProgressReportAssessments.Update(assessment);
                await dbContext.SaveChangesAsync();

                return StatusCode(500, result);
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
}