using iPulse_back_end.DB_Models;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using iPulse_back_end.Helpers.Enums;
using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Helpers.Enums;
using iPulse_back_end.Models;
using System.Text.Json;

namespace iPulse_back_end.Controllers;

[ApiController]
[Authorize]
[Route("api/patient")]
public class GeneralHealthSummariesController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;

    public GeneralHealthSummariesController(IConfiguration configuration, IPulseContext context)
    {
        this.configuration = configuration;
        this.dbContext = context;
    }

    // GET ALL FOR PATIENT
    /// <summary>Retrieves all health summaries for a patient.</summary>
    /// <param name="patientId">The patient's id.</param>
    /// <returns>A list of health summaries.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_PATIENT_ROLE)]
    [HttpGet("{patientId}/health-summaries")]
    public async Task<IActionResult> GetAllForPatient(int patientId)
    {
        try
        {
            // check if patient exists
            var patient = await dbContext.PatientProfiles.Where(p => p.UserId == patientId).FirstOrDefaultAsync();
            if (patient is null)
            {
                return NotFound(new Response { errorMessage = "Patient not found", data = "" });
            }

            // get records
            var healthSummaries = await (
                from ghs in dbContext.GeneralHealthSummaries
                join doc in dbContext.UserAccounts on ghs.DoctorId equals doc.UserId
                where ghs.PatientId == patientId

                select new
                {
                    ghs.Id,
                    doc.FirstName,
                    doc.LastName,
                    doc.Email,
                    doc.ProfilePicPath,
                    ghs.CreatedAt,
                    ghs.UpdatedAt
                }
            ).ToListAsync();
            return Ok(new Response { errorMessage = "", data = healthSummaries });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    // GET SINGLE
    /// <summary>Retrieves a single record.</summary>
    /// <param name="recordId">The record's unique identifier.</param>
    /// <returns>The record.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_PATIENT_ROLE)]
    [HttpGet("health-summaries/{recordId}")]
    public async Task<IActionResult> GetSingle(int recordId)
    {
        try
        {
            // check if record exists
            // var record = await (
            //     from ghs in dbContext.GeneralHealthSummaries
            //     join patient in dbContext.UserAccounts on ghs.PatientId equals patient.UserId
            //     join doctor in dbContext.UserAccounts on ghs.DoctorId equals doctor.UserId

            //     where ghs.Id == recordId

            //     select new
            //     {
            //         ghs.Id,
            //         ghs.PatientId,
            //         ghs.DoctorId,

            //         ghs.Content,

            //         doctor.Email,
            //         doctor.FirstName,
            //         doctor.LastName
            //     }
            // ).FirstOrDefaultAsync();
            var record = await dbContext.GeneralHealthSummaries.Where(ghs => ghs.Id == recordId)
            .Select(ghs => new
            {
                ghs.Id,
                ghs.PatientId,
                ghs.DoctorId,

                ghs.Content,
            })
            .FirstOrDefaultAsync();
            if (record is null)
            {
                return NotFound(new Response { errorMessage = "Record not found", data = "" });
            }

            // get user id from jwt token
            var claim = this.User.FindFirst("userId");
            if (claim is null)
            {
                return StatusCode(403, new Response { errorMessage = "Invalid token provided", data = "" });
            }

            // check if user requesting record is either the patient of the record
            // or the doctor who created it
            var userId = Int64.Parse(claim.Value);
            if (userId != record.PatientId && userId != record.DoctorId)
            {
                return StatusCode(403, new Response { errorMessage = "User not authorized to view this record", data = "" });
            }

            return Ok(new Response { errorMessage = "", data = record });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //----   ADD HEALTH SUMMARY   ----
    /// <summary>Adds a general health summary.</summary>
    /// <param name="details">The details of the health summary.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpPost("health-summaries")]
    public async Task<IActionResult> AddHealthSummary(AddGeneralHealthSummary details)
    {
        try
        {
            // check for null patient and doctor id's
            if (details.patientId is null || details.doctorId is null)
            {
                return BadRequest(new Response { errorMessage = "doctor or patient id is null", data = "" });
            }

            // check if doctor exists
            if (!await dbContext.DoctorProfiles.AnyAsync(d => d.UserId == details.doctorId))
            {
                return NotFound(new Response { errorMessage = "doctor not found", data = "" });
            }

            // check if patient exists
            if (!await dbContext.PatientProfiles.AnyAsync(p => p.UserId == details.patientId))
            {
                return NotFound(new Response { errorMessage = "patient not found", data = "" });
            }

            // create record
            var healthSummary = new GeneralHealthSummary()
            {
                DoctorId = (int)details.doctorId,
                PatientId = (int)details.patientId,
                Content = details.content ?? JsonSerializer.Serialize("{}"),
            };

            // save to db
            await dbContext.GeneralHealthSummaries.AddAsync(healthSummary);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "successful" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Server error, try again later!", data = "" });
        }
    }

    //----   EDIT HEALTH SUMMARY   ----
    /// <summary>Edits a health summary.</summary>
    /// <param name="details">The details of the health summary to edit.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpPost("health-summaries/edit")]
    public async Task<IActionResult> EditHealthSummary(EditGeneralHealthSummary details)
    {
        try
        {
            // check for null patient and doctor id's
            if (details.id is null)
            {
                return BadRequest(new Response { errorMessage = "id is null", data = "" });
            }

            // get record
            var healthSummary = await dbContext.GeneralHealthSummaries.Where(ghs => ghs.Id == details.id).FirstOrDefaultAsync();
            if (healthSummary is null)
            {
                return NotFound(new Response { errorMessage = "record not found", data = "" });
            }

            // get user id from jwt token
            var claim = this.User.FindFirst("userId");
            if (claim is null)
            {
                return StatusCode(403, new Response { errorMessage = "Invalid token provided", data = "" });
            }

            // check if user requesting record is either the patient of the record
            // or the doctor who created it
            var userId = Int64.Parse(claim.Value);
            if (userId != healthSummary.DoctorId)
            {
                return StatusCode(403, new Response { errorMessage = "User not authorized to edit this record", data = "" });
            }

            // edit record
            healthSummary.Content = details.content ?? healthSummary.Content;

            // save to db
            dbContext.GeneralHealthSummaries.Update(healthSummary);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "successful" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Server error, try again later!", data = "" });
        }
    }

    //----   DELETE HEALTH SUMMARY   ----
    /// <summary>Deletes a health summary.</summary>
    /// <param name="id">The id of the health summary to delete.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_PATIENT_ROLE)]
    [HttpDelete("health-summaries/{id}")]
    public async Task<IActionResult> DeleteHealthSummary(int id)
    {
        try
        {
            // get specialty to delete
            var healthSummary = await dbContext.GeneralHealthSummaries.FirstOrDefaultAsync(ghs => ghs.Id == id);
            if (healthSummary is null)
            {
                return NotFound(new Response { errorMessage = "record not found", data = "" });
            }

            // get user id from jwt token
            var claim = this.User.FindFirst("userId");
            if (claim is null)
            {
                return StatusCode(403, new Response { errorMessage = "Invalid token provided", data = "" });
            }

            // check if user deleting record is either the patient of the record
            // or the doctor who created it
            var userId = Int64.Parse(claim.Value);
            if (userId != healthSummary.PatientId && userId != healthSummary.DoctorId)
            {
                return StatusCode(403, new Response { errorMessage = "User not authorized to delete this record", data = "" });
            }

            // delete
            dbContext.GeneralHealthSummaries.Remove(healthSummary);
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
}