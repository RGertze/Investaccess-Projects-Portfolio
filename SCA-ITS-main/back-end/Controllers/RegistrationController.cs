using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using SCA_ITS_back_end.Helpers;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;

namespace SCA_ITS_back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private IS3Service s3Service;
    private RegistrationService registrationService;
    private ParentsService parentsService;

    public RegistrationController(IConfiguration configuration, SCA_ITSContext context, IS3Service s3Service, RegistrationService registrationService, ParentsService parentsService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.s3Service = s3Service;
        this.registrationService = registrationService;
        this.parentsService = parentsService;
    }

    //---   GET REGISTRATION REQUESTS  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet("requests")]
    public async Task<IActionResult> GetRegistrationRequests()
    {
        try
        {
            var result = await registrationService.GetParentsRegisteringOrWithRegisteringStudents();
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


    //---   GET REQUIRED REGISTRATION DOCS FOR PARENTS  ---
    [HttpGet("required-docs/parents/")]
    public async Task<IActionResult> GetRequiredParentDocuments()
    {
        try
        {
            var docs = await dbContext.RequiredRegistrationDocuments.Where(d => d.UserTypeId == 2).Select(d => new
            {
                d.Id,
                d.Name,
                d.Description
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = docs });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET PARENT UPLOADED REQUIRED REGISTRATION DOCS FOR USER  ---
    [HttpGet("parent/required-docs/uploaded")]
    public async Task<IActionResult> GetUploadedRequiredDocuments([FromQuery][Required] int reqId, [FromQuery][Required] int userId)
    {
        try
        {

            // check if required doc exists
            if (!(await dbContext.RequiredRegistrationDocuments.AnyAsync(rd => rd.Id == reqId)))
                return NotFound(new Response { errorMessage = "Required document does not exist", data = "" });

            // check if user exists
            if (!(await dbContext.UserAccounts.AnyAsync(u => u.UserId == userId)))
                return NotFound(new Response { errorMessage = "User does not exist", data = "" });

            var uploadedDocs = await dbContext.ParentRegistrationFiles.Where(f => f.RequiredId == reqId && f.UserId == userId).Select(f => new
            {
                fileName = f.Name,
                filePath = f.FilePath
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = uploadedDocs });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    // ADD PARENT REGISTRATION FILE
    [HttpPost("parents/files/upload")]
    public async Task<IActionResult> AddParentRegistrationFile(AddParentRegistrationFileRequest details)
    {
        try
        {

            var result = await registrationService.AddParentRegistrationFile(details);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            return CreatedAtAction(nameof(AddParentRegistrationFile), result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }


    // DELETE PARENT REGISTRATION FILE
    [HttpPost("parents/files/delete")]
    public async Task<IActionResult> DeleteParentRegistrationFile(DeleteFileRequest details)
    {
        try
        {
            var result = await registrationService.DeleteParentRegistrationFile(details);
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

    //---   GET REGISTRATION STATUS FOR PARENT  ---
    [HttpGet("parent/status/{parentId}")]
    public async Task<IActionResult> GetRegistrationStatusForParent(int parentId)
    {
        try
        {
            var result = await registrationService.GetParentRegistrationStatus(parentId);
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

    // REQUEST PARENT REGISTRATION APPROVAL
    [HttpGet("parent/approval/request/{parentId}")]
    public async Task<IActionResult> RequestParentRegistrationApproval(int parentId)
    {
        try
        {
            // get parent
            var parent = await dbContext.Parents.Where(p => p.UserId == parentId).FirstOrDefaultAsync();
            if (parent is null)
                return NotFound(new Response { errorMessage = "parent not found", data = "" });

            // set approval requested to true
            parent.RegistrationStage = (int)PARENT_REGISTRATION_STATUS.APPROVED;

            // update db
            dbContext.Parents.Update(parent);
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

    // ADD REQUIRED REGISTRATION DOCUMENT
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("required-docs")]
    public async Task<IActionResult> AddRequiredRegistrationDocument(AddRequiredRegistrationDoc details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }
        try
        {
            // check if user type exists
            if (!await dbContext.UserTypes.AnyAsync(u => u.UserTypeId == details.userTypeId))
                return NotFound(new Response { errorMessage = "User type not found", data = "" });

            // check if required doc exists
            if (await dbContext.RequiredRegistrationDocuments.AnyAsync(d => d.Name == details.name && d.UserTypeId == details.userTypeId))
                return Conflict(new Response { errorMessage = "That name has already been used", data = "" });

            // add doc
            RequiredRegistrationDocument requiredDoc = new RequiredRegistrationDocument()
            {
                Name = details.name,
                Description = details.description,
                UserTypeId = (int)details.userTypeId
            };
            await dbContext.RequiredRegistrationDocuments.AddAsync(requiredDoc);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(AddStudentRegistrationFile), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    // EDIT REQUIRED REGISTRATION DOCUMENT
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("required-docs/edit")]
    public async Task<IActionResult> EditRequiredRegistrationDocument(EditRequiredRegistrationDoc details)
    {
        if (details.id is null)
        {
            return BadRequest(new Response { errorMessage = "Id is null", data = "" });
        }
        try
        {
            // get required doc
            var requiredDoc = await dbContext.RequiredRegistrationDocuments.FirstOrDefaultAsync(doc => doc.Id == details.id);
            if (requiredDoc is null)
                return NotFound(new Response { errorMessage = "Record not found", data = "" });

            // edit
            requiredDoc.Name = details.name ?? requiredDoc.Name;
            requiredDoc.Description = details.description ?? requiredDoc.Description;

            // save changes
            dbContext.RequiredRegistrationDocuments.Update(requiredDoc);
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

    //---   DELETE REQUIRED REGISTRATION DOCUMENT  ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("required-docs/{id}")]
    public async Task<IActionResult> DeleteRequiredRegistrationDocument(int id)
    {
        try
        {
            var result = await registrationService.DeleteRequiredRegistrationDocument(id);
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

    //---   GET REQUIRED REGISTRATION DOCS FOR STUDENTS  ---
    [HttpGet("required-docs/students/")]
    public async Task<IActionResult> GetRequiredStudentDocuments()
    {
        try
        {
            var docs = await dbContext.RequiredRegistrationDocuments.Where(d => d.UserTypeId == 4).Select(d => new
            {
                d.Id,
                d.Name,
                d.Description
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = docs });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET STUDENT UPLOADED REQUIRED REGISTRATION DOCS FOR USER  ---
    [HttpGet("student/required-docs/uploaded")]
    public async Task<IActionResult> GetStudentUploadedRequiredDocuments([FromQuery][Required] int reqId, [FromQuery][Required] string studentNumber)
    {
        try
        {

            // check if required doc exists
            if (!(await dbContext.RequiredRegistrationDocuments.AnyAsync(rd => rd.Id == reqId)))
                return NotFound(new Response { errorMessage = "Required document does not exist", data = "" });

            // check if user exists
            if (!(await dbContext.Students.AnyAsync(s => s.StudentNumber == studentNumber)))
                return NotFound(new Response { errorMessage = "Student does not exist", data = "" });

            var uploadedDocs = await dbContext.StudentRegistrationFiles.Where(f => f.RequiredId == reqId && f.StudentNumber == studentNumber).Select(f => new
            {
                fileName = f.Name,
                filePath = f.FilePath
            }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = uploadedDocs });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    // ADD STUDENT REGISTRATION FILE
    [HttpPost("students/files/upload")]
    public async Task<IActionResult> AddStudentRegistrationFile(AddStudentRegistrationFileRequest details)
    {
        try
        {
            var result = await registrationService.AddStudentRegistrationFile(details);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            return CreatedAtAction(nameof(AddStudentRegistrationFile), result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    // DELETE STUDENT REGISTRATION FILE
    [HttpPost("students/files/delete")]
    public async Task<IActionResult> DeleteStudentRegistrationFile(DeleteFileRequest details)
    {
        try
        {

            var result = await registrationService.DeleteStudentRegistrationFile(details);
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

    //---   GET REGISTRATION STATUS FOR STUDENT  ---
    [HttpGet("student/status/{studentNumber}")]
    public async Task<IActionResult> GetRegistrationStatusForStudent(string studentNumber)
    {
        try
        {
            var result = await registrationService.GetStudentRegistrationStatus(studentNumber);
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

    // REQUEST STUDENT REGISTRATION APPROVAL
    [HttpGet("student/approval/request/{studentNumber}")]
    public async Task<IActionResult> RequestStudentRegistrationApproval(string studentNumber)
    {
        try
        {
            // get student
            var student = await dbContext.Students.Where(s => s.StudentNumber == studentNumber).FirstOrDefaultAsync();
            if (student is null)
                return NotFound(new Response { errorMessage = "student not found", data = "" });

            // set approval requested to true
            student.RegistrationStage = (int)STUDENT_REGISTRATION_STATUS.APPROVAL_REQUESTED;
            student.RejectionMessage = null;

            // update db
            dbContext.Students.Update(student);
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


    //----   EDIT STUDENT REGISTRATION STATUS   ----
    [HttpPost("student/status/edit")]
    public async Task<IActionResult> EditStudentRegistrationStatus(EditStudentRegistrationStatus details)
    {
        try
        {
            var result = await registrationService.EditStudentRegistrationStatus(details);
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

    //----   GET STUDENT THERAPY FILES   ----
    [HttpGet("student/therapy/files/{studentNumber}")]
    public async Task<IActionResult> GetStudentTherapyFiles(string studentNumber)
    {
        try
        {
            var result = await registrationService.GetTherapyReports(studentNumber);
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

    //----   ADD STUDENT THERAPY FILE   ----
    [HttpPost("student/therapy/files")]
    public async Task<IActionResult> AddStudentTherapyFile(AddStudentTherapyFile details)
    {
        try
        {
            var result = await registrationService.AddTherapyReport(details);
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

    //----   DELETE STUDENT THERAPY FILE   ----
    [HttpDelete("student/therapy/files/{filePath}")]
    public async Task<IActionResult> DeleteStudentTherapyFile(string filePath)
    {
        try
        {
            var result = await registrationService.DeleteTherapyReport(filePath);
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


    //----   EDIT PARENT REGISTRATION STATUS   ----
    [HttpPost("parent/status/edit")]
    public async Task<IActionResult> EditParentRegistrationStatus(EditParentRegistrationStatus details)
    {
        try
        {
            var result = await registrationService.EditParentRegistrationStatus(details);
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

    //----   GET PARENT REGISTRATION FEE FILE   ----
    [HttpGet("parent/registration-fee/files/{parentId}")]
    public async Task<IActionResult> GetParentRegistrationFeeFile(int parentId)
    {
        try
        {
            var result = await registrationService.GetParentRegistrationFeeFiles(parentId);
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



    //----   ADD PARENT REGISTRATION FEE FILE   ----
    [HttpPost("parent/registration-fee/files")]
    public async Task<IActionResult> AddParentRegistrationFeeFile(AddParentRegistrationFeeFile details)
    {
        try
        {
            var result = await registrationService.AddParentRegistrationFeeFile(details);
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

    //----   DELETE PARENT REGISTRATION FEE FILE   ----
    [HttpDelete("parent/registration-fee/files/{filePath}")]
    public async Task<IActionResult> DeleteParentRegistrationFeeFile(string filePath)
    {
        try
        {
            var result = await registrationService.DeleteParentRegistrationFeeFile(filePath);
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


}