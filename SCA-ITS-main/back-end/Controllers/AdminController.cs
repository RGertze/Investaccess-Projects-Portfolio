using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
[ApiController]
[Route("api/[controller]")]
public class AdminController : Controller
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private IMailHandler mailHandler;
    private StudentReportService studentReportService;
    private FinancialStatementService financialStatementService;
    private StudentService studentService;
    private UserService userService;
    private RegistrationService registrationService;

    public AdminController(IConfiguration configuration, SCA_ITSContext context, IMailHandler mailHandler, StudentReportService studentReportService, FinancialStatementService financialStatementService, StudentService studentService, UserService userService, RegistrationService registrationService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.mailHandler = mailHandler;
        this.studentService = studentService;
        this.studentReportService = studentReportService;
        this.financialStatementService = financialStatementService;
        this.userService = userService;
        this.registrationService = registrationService;
    }

    //---   GET DASHBOARD INFO  ---
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardInfo()
    {
        try
        {
            var data = new
            {
                studentCount = await dbContext.Students.Where(s => s.RegistrationStage == (int)STUDENT_REGISTRATION_STATUS.APPROVED).CountAsync(),
                parentsCount = await dbContext.UserAccounts.Where(u => u.UserTypeId == 2 && u.IsApproved == 1).CountAsync(),
                staffCount = await dbContext.UserAccounts.Where(u => u.UserTypeId == 3).CountAsync(),

                coursesCount = await dbContext.Courses.CountAsync(),

                parentRegistrationCount = await (
                    from u in dbContext.UserAccounts
                    join p in dbContext.Parents on u.UserId equals p.UserId
                    where u.IsApproved == 0 && p.RegistrationStage != (int)PARENT_REGISTRATION_STATUS.REJECTED
                    select p
                ).CountAsync(),
                studentRegistrationCount = await (
                    from s in dbContext.Students
                    join p in dbContext.UserAccounts on s.ParentId equals p.UserId
                    where (s.RegistrationStage != (int)STUDENT_REGISTRATION_STATUS.APPROVED && s.RegistrationStage != (int)STUDENT_REGISTRATION_STATUS.REJECTED) //&& p.IsApproved == 1
                    select s
                ).CountAsync(),

                proofOfDepositsCount = await dbContext.ProofOfDeposits.Where(p => p.Status == (int)Proof_Of_Deposit_Status.PENDING).CountAsync(),
                totalOutstandingFees = await dbContext.ParentFinancialStatements.Where(p => p.CurrentBalance < 0).SumAsync(p => -p.CurrentBalance),
                outstandingFeesCount = await dbContext.ParentFinancialStatements.Where(p => p.CurrentBalance < 0).CountAsync(),
                noFeesCount = await (
                    from p in dbContext.Parents
                    join f in dbContext.ParentFinancialStatements on p.UserId equals f.ParentId
                    where f.CurrentBalance >= 0
                    && p.RegistrationStage == (int)PARENT_REGISTRATION_STATUS.APPROVED
                    select p
                ).CountAsync()
            };

            return Ok(new Response { errorMessage = "", data = data });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET PARENT REGISTRATION REQUESTS  ---
    [HttpGet("parent/registration/all")]
    public async Task<IActionResult> GetParentRegistrationRequests(int parentId)
    {
        try
        {
            // get parent registration requests
            var requests = await (
                from u in dbContext.UserAccounts
                join p in dbContext.Parents on u.UserId equals p.UserId
                where u.IsApproved == 0
                select new
                {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = requests });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET STUDENT REGISTRATION REQUESTS  ---
    [HttpGet("student/registration/all")]
    public async Task<IActionResult> GetStudentRegistrationRequests()
    {
        try
        {
            // get student registration requests
            var requests = await (
                from s in dbContext.Students
                join p in dbContext.UserAccounts on s.ParentId equals p.UserId
                where (s.RegistrationStage != (int)STUDENT_REGISTRATION_STATUS.APPROVED)
                // && p.IsApproved == 1    // only get requests from approved parents
                // temporarily allow unregistered parents to have their student's registration completed
                select new
                {
                    s.StudentNumber,
                    s.FirstName,
                    s.LastName,
                    s.Grade,
                    s.RegistrationStage,
                    CreatedAt = s.CreatedAt.ToString()
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = requests });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    /*----   APPROVE PARENT REGISTRATION   ----*/
    [HttpPost("parent/registration/approve")]
    public async Task<IActionResult> ApproveParentRegistration(ApproveRejectParentRegistrationRequest details)
    {
        try
        {
            var result = await registrationService.ApproveParent(details);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    /*----   REJECT PARENT REGISTRATION   ----*/
    [HttpPost("parent/registration/reject")]
    public async Task<IActionResult> RejectParentRegistration(ApproveRejectParentRegistrationRequest details)
    {
        try
        {
            var result = await registrationService.RejectParentRegistration(details);
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

    /*----   APPROVE STUDENT REGISTRATION   ----*/
    [HttpPost("student/registration/approve")]
    public async Task<IActionResult> ApproveStudentRegistration(ApproveRejectStudentRegistrationRequest details)
    {
        try
        {
            var result = await registrationService.ApproveStudent(details);
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

    /*----   REJECT STUDENT REGISTRATION   ----*/
    [HttpPost("student/registration/reject")]
    public async Task<IActionResult> RejectStudentRegistration(RejectStudentRegistration details)
    {
        try
        {
            var result = await registrationService.RejectStudentRegistration(details);
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

    /*----   UPDATE USER PASSWORD   ----*/
    [HttpPost("users/password/edit")]
    public async Task<IActionResult> UpdateUserPassword(UpdateUserPassword details)
    {
        try
        {
            var result = await userService.EditPassword(details);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }
}