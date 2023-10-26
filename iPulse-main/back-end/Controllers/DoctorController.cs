using System.ComponentModel.DataAnnotations;
using System.Reflection.PortableExecutable;
using System.Runtime.CompilerServices;
using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers.Enums;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DoctorController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;

    public DoctorController(IConfiguration configuration, IPulseContext context)
    {
        this.configuration = configuration;
        this.dbContext = context;
    }

    //---   GET ALL DOCTORS   ---
    /// <summary>Gets all doctors.</summary>
    /// <returns>All doctors.</returns>
    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var doctors = await (
                from user in dbContext.UserAccounts
                join doc in dbContext.DoctorProfiles on user.UserId equals doc.UserId
                join specialty in dbContext.DoctorSpecialties on doc.SpecialtyId equals specialty.SpecialtyId
                select new
                {
                    user.UserId,
                    user.ProfilePicPath,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    specialty.SpecialtyId,
                    specialty.SpecialtyName,

                    rating = dbContext.DoctorReviews.Where(r => r.DoctorId == doc.UserId).Average(r => r.Rating) ?? 0,
                    numberOfReviews = dbContext.DoctorReviews.Where(r => r.DoctorId == doc.UserId).Count(),

                    location = $"{doc.PracticeCity}, {doc.PracticeCountry}",
                    appointmentPrice = doc.AppointmentPrice ?? 0
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = doctors });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    // GET ALL DOCTOR SPECIALTIES
    /// <summary>Retrieves all the specialties.</summary>
    /// <returns>All the specialties.</returns>
    [AllowAnonymous]
    [HttpGet("specialties")]
    public async Task<IActionResult> GetAllSpecialties()
    {
        try
        {
            var specialties = await dbContext.DoctorSpecialties.Select(ds => new { ds.SpecialtyId, ds.SpecialtyName }).ToListAsync();
            return Ok(new Response { errorMessage = "", data = specialties });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }

    // GET DOCTOR PROFILE
    /// <summary>Retrieves the profile of a doctor.</summary>
    /// <param name="id">The id of the doctor.</param>
    /// <returns>The profile of the doctor.</returns>
    [HttpGet("profile/{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            // get doctor profile
            var profile = await (
                from d in dbContext.DoctorProfiles
                join s in dbContext.DoctorSpecialties on d.SpecialtyId equals s.SpecialtyId
                where d.UserId == id
                select new
                {
                    s.SpecialtyId,
                    s.SpecialtyName,
                    d.Nationality,
                    d.PracticeNumber,
                    d.PracticeName,
                    d.PracticeAddress,
                    d.PracticeCity,
                    d.PracticeCountry,
                    d.PracticeWebAddress,
                    d.BusinessHours,
                    d.AppointmentPrice,
                    d.SecondaryCellphone,
                    d.SecondaryEmail
                }).FirstOrDefaultAsync();
            if (profile is null)
            {
                return NotFound(new Response { errorMessage = "Doctor profile not found!", data = "" });
            }

            return Ok(new Response { errorMessage = "", data = profile });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve profile!", data = "" });
        }
    }

    // UPDATE DOCTOR PROFILE
    /// <summary>Updates the doctor's profile.</summary>
    /// <param name="details">The details of the doctor's profile.</param>
    /// <returns>A response object indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpPost("profile/update")]
    public async Task<IActionResult> UpdateDoctorProfile(DoctorProfileUpdateRequest details)
    {
        try
        {
            // get doctor profile
            var profile = await dbContext.DoctorProfiles.Where(p => p.UserId == details.UserId).FirstOrDefaultAsync();
            if (profile is null)
            {
                return NotFound(new Response { errorMessage = "Doctor profile not found!", data = "" });
            }

            // update profile values
            profile.SpecialtyId = (profile.SpecialtyId == details.SpecialtyId || details.SpecialtyId is null) ? profile.SpecialtyId : (int)details.SpecialtyId;
            profile.Nationality = (profile.Nationality == details.Nationality || details.Nationality is null) ? profile.Nationality : details.Nationality;
            profile.PracticeNumber = (profile.PracticeNumber == details.PracticeNumber || details.PracticeNumber is null) ? profile.PracticeNumber : details.PracticeNumber;
            profile.PracticeName = (profile.PracticeName == details.PracticeName || details.PracticeName is null) ? profile.PracticeName : details.PracticeName;
            profile.PracticeAddress = (profile.PracticeAddress == details.PracticeAddress || details.PracticeAddress is null) ? profile.PracticeAddress : details.PracticeAddress;
            profile.PracticeCity = (profile.PracticeCity == details.PracticeCity || details.PracticeCity is null) ? profile.PracticeCity : details.PracticeCity;
            profile.PracticeCountry = (profile.PracticeCountry == details.PracticeCountry || details.PracticeCountry is null) ? profile.PracticeCountry : details.PracticeCountry;
            profile.PracticeWebAddress = (profile.PracticeWebAddress == details.PracticeWebAddress || details.PracticeWebAddress is null) ? profile.PracticeWebAddress : details.PracticeWebAddress;
            profile.BusinessHours = (profile.BusinessHours == details.BusinessHours || details.BusinessHours is null) ? profile.BusinessHours : details.BusinessHours;
            profile.AppointmentPrice = (profile.AppointmentPrice == details.AppointmentPrice || details.AppointmentPrice is null) ? profile.AppointmentPrice : details.AppointmentPrice;
            profile.SecondaryCellphone = (profile.SecondaryCellphone == details.SecondaryCellphone || details.SecondaryCellphone is null) ? profile.SecondaryCellphone : details.SecondaryCellphone;
            profile.SecondaryEmail = (profile.SecondaryEmail == details.SecondaryEmail || details.SecondaryEmail is null) ? profile.SecondaryEmail : details.SecondaryEmail;

            // update db
            dbContext.DoctorProfiles.Update(profile);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "successful" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to update profile!", data = "" });
        }
    }

    // ADD DOCTOR WORK HISTORY
    /// <summary>Adds a doctor's work history.</summary>
    /// <param name="details">The details of the work history to add.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpPost("work-history")]
    public async Task<IActionResult> AddDoctorWorkHistory(AddDoctorWorkHistoryRequest details)
    {

        // check for empty or null values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(new Response { errorMessage = "Invalid data!", data = "" });
        }

        try
        {
            // check if doctor exists
            if (!(await dbContext.DoctorProfiles.AnyAsync(d => d.UserId == details.doctorId)))
            {
                return NotFound(new Response { errorMessage = "Doctor not found!", data = "" });
            }

            DateOnly startDate;
            DateOnly endtDate;
            // check if dates are valid
            if (!DateOnly.TryParse(details.startDate, out startDate) || !DateOnly.TryParse(details.endDate, out endtDate))
            {
                return BadRequest(new Response { errorMessage = "Invalid dates passed!", data = "" });
            }

            // add work history
            DoctorWorkHistory workHistory = new DoctorWorkHistory()
            {
                DoctorId = details.doctorId,
                CompanyName = details.companyName,
                StartDate = startDate,
                EndDate = endtDate,
                Role = details.role,
                Duties = details.duties,
            };

            // update db
            dbContext.DoctorWorkHistories.Update(workHistory);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "successful" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to add work history!", data = "" });
        }
    }

    // GET ALL A DOCTOR'S WORK HISTORY
    /// <summary>Retrieves all work history of a doctor.</summary>
    /// <param name="id">The doctor's id.</param>
    /// <returns>All work history of a doctor.</returns>
    [HttpGet("work-history/{id}")]
    public async Task<IActionResult> GetAllWorkHistory(int id)
    {
        try
        {
            var workHistory = await dbContext.DoctorWorkHistories.Select(wh => new
            {
                wh.DoctorWorkHistoryId,
                wh.DoctorId,
                wh.CompanyName,
                StartDate = wh.StartDate.ToString(),
                EndDate = wh.EndDate.ToString(),
                wh.Role,
                wh.Duties
            }).Where(wh => wh.DoctorId == id).ToListAsync();
            return Ok(new Response { errorMessage = "", data = workHistory });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }

    // DELETE DOCTOR WORK HISTORY
    /// <summary>Deletes a doctor's work history.</summary>
    /// <param name="id">The id of the work history to delete.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpDelete("work-history/{id}")]
    public async Task<IActionResult> DeleteDoctorWorkHistory(int id)
    {
        try
        {
            var workHistory = await dbContext.DoctorWorkHistories.Where(wh => wh.DoctorWorkHistoryId == id).FirstOrDefaultAsync();
            if (workHistory is null)
            {
                return NotFound(new Response { errorMessage = "Work history does not exist", data = "" });
            }

            dbContext.DoctorWorkHistories.Remove(workHistory);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to delete data. Try again later.", data = "" });
        }
    }

    // GET DOCTOR EDUCATION
    /// <summary>Retrieves the education details of a doctor.</summary>
    /// <param name="doctorId">The doctor's id.</param>
    /// <returns>The education details of the doctor.</returns>
    [HttpGet("education/{doctorId}")]
    public async Task<IActionResult> GetDoctorEducation(int doctorId)
    {
        try
        {
            // get education
            var education = await (
                from edu in dbContext.DoctorEducations
                where edu.DoctorId == doctorId
                select new
                {
                    id = edu.DoctorEducationId,
                    edu.InstituteName,
                    edu.QualificationName
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = education });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve profile!", data = "" });
        }
    }

    // ADD DOCTOR EDUCATION
    /// <summary>Adds a doctor's education.</summary>
    /// <param name="details">The details of the education.</param>
    /// <returns>A response indicating whether the operation succeeded.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpPost("education")]
    public async Task<IActionResult> AddDoctorEducation(AddDoctorEducation details)
    {
        // check for empty or null values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(new Response { errorMessage = "Invalid data!", data = "" });
        }

        try
        {
            // check if doctor exists
            if (!(await dbContext.DoctorProfiles.AnyAsync(d => d.UserId == details.doctorId)))
            {
                return NotFound(new Response { errorMessage = "Doctor not found!", data = "" });
            }

            // add work history
            DoctorEducation education = new DoctorEducation()
            {
                DoctorId = details.doctorId,
                InstituteName = details.instituteName,
                QualificationName = details.qualificationName
            };

            // update db
            dbContext.DoctorEducations.Update(education);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "successful" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to add work history!", data = "" });
        }
    }

    // DELETE DOCTOR EDUCATION
    /// <summary>Deletes a doctor's education.</summary>
    /// <param name="id">The id of the education to delete.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpDelete("education/{id}")]
    public async Task<IActionResult> DeleteDoctorEducation(int id)
    {
        try
        {
            var education = await dbContext.DoctorEducations.Where(edu => edu.DoctorEducationId == id).FirstOrDefaultAsync();
            if (education is null)
            {
                return NotFound(new Response { errorMessage = "Work history does not exist", data = "" });
            }

            dbContext.DoctorEducations.Remove(education);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to delete data. Try again later.", data = "" });
        }
    }

    // GET PATIENT DOCTOR TYPES
    /// <summary>Gets the list of patient doctor types.</summary>
    /// <returns>The list of patient doctor types.</returns>
    [HttpGet("personal/types")]
    public async Task<IActionResult> GetPatientDoctorTypes()
    {
        try
        {
            // get requests
            var types = await dbContext.PatientDoctorTypes.Select(pdt => new
            {
                pdt.TypeId,
                pdt.TypeName
            }).ToListAsync();
            return Ok(new Response { errorMessage = "", data = types });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }

    // GET REQUESTS TO BE PERSONAL DOCTOR
    /// <summary>Retrieves the requests to be a personal doctor.</summary>
    /// <param name="doctorId">The doctor's id.</param>
    /// <returns>The requests to be a personal doctor.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpGet("personal/requests/{doctorId}")]
    public async Task<IActionResult> GetRequestsToBePersonalDoctor(int doctorId)
    {
        try
        {
            // check if doctor exists
            if (!(await dbContext.DoctorProfiles.AnyAsync(d => d.UserId == doctorId)))
                return NotFound(new Response { errorMessage = "Doctor not found", data = "" });

            // get requests
            var requests = await (
                from pd in dbContext.PatientDoctors
                join p in dbContext.UserAccounts on pd.PatientId equals p.UserId
                where pd.DoctorId == doctorId && pd.Status == (int)Status.PENDING
                select new
                {
                    pd.PatientId,
                    pd.DoctorId,
                    pd.Status,
                    pd.ApprovalCode,
                    p.FirstName,
                    p.LastName,
                    p.Email,
                    p.ProfilePicPath
                }
            ).ToListAsync();
            return Ok(new Response { errorMessage = "", data = requests });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }

    // GET REQUEST TO BE PERSONAL DOCTOR STATUS FOR PATIENT
    /// <summary>Retrieves the status of the request to be a personal doctor.</summary>
    /// <param name="patientId">The patient's id.</param>
    /// <param name="doctorId">The doctor's id.</param>
    /// <returns>The status of the request to be a personal doctor.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("personal/requests/check")]
    public async Task<IActionResult> GetRequestToBePersonalDoctorStatus([FromQuery][Required] int patientId, [FromQuery][Required] int doctorId)
    {
        try
        {
            // get request
            var request = await (
                from pd in dbContext.PatientDoctors
                where pd.DoctorId == doctorId && pd.PatientId == patientId
                select new
                {
                    pd.Status,
                    pd.ApprovalCode
                }).FirstOrDefaultAsync();
            if (request is null)
            {
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });
            }

            return Ok(new Response { errorMessage = "", data = request });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve access record!", data = "" });
        }
    }

    // REQUEST DOCTOR TO BE PERSONAL DOCTOR
    /// <summary>Request a doctor to be your personal doctor.</summary>
    /// <param name="details">The details of the request.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("personal/requests/")]
    public async Task<IActionResult> RequestDoctorToBePersonalDoctor(RequestDoctorToBePersonalDoctor details)
    {
        // check for any null or empty values
        if (ProfileAccessRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        // check if doctor exists
        if (!(await dbContext.DoctorProfiles.AnyAsync(d => d.UserId == details.doctorId)))
            return NotFound(new Response { errorMessage = "Doctor not found", data = "" });

        // check if patient exists
        if (!(await dbContext.PatientProfiles.AnyAsync(p => p.UserId == details.patientId)))
            return NotFound(new Response { errorMessage = "Patient not found", data = "" });

        try
        {
            // find existing record
            var record = await dbContext.PatientDoctors.Where(p => p.PatientId == details.patientId && p.DoctorId == details.doctorId).FirstOrDefaultAsync();

            if (record is null)
            {
                // create new record if it doesnt exist
                record = new PatientDoctor()
                {
                    DoctorId = details.doctorId,
                    PatientId = details.patientId,
                    TypeId = details.typeId ?? 1,
                    ApprovalCode = Guid.NewGuid().ToString(),
                    Status = (int)Status.PENDING                  // set state to pending
                };

                // add record
                await dbContext.PatientDoctors.AddAsync(record);
            }
            else
            {
                // edit existing record
                record.ApprovalCode = Guid.NewGuid().ToString();
                record.Status = (int)Status.PENDING;      // set state to pending

                // update record
                dbContext.PatientDoctors.Update(record);
            }

            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(RequestDoctorToBePersonalDoctor), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    // APPROVE REQUEST TO BE PERSONAL DOCTOR
    /// <summary>Approve a request to be a personal doctor.</summary>
    /// <param name="details">The details of the request.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpPost("personal/requests/approve")]
    public async Task<IActionResult> ApproveRequestToBePersonalDoctor(ApproveRejectRequestToBePersonalDoctor details)
    {
        // check for any null or empty values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // find record
            var record = await dbContext.PatientDoctors.Where(p => p.PatientId == details.patientId && p.DoctorId == details.doctorId).FirstOrDefaultAsync();
            if (record is null)
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });

            // check for correct approval code
            if (record.ApprovalCode != details.approvalCode)
                return StatusCode(403, new Response { errorMessage = "Wrong approval code!", data = "" });

            // edit record
            record.Status = (int)Status.APPROVED;      // set state to approved

            // update record
            dbContext.PatientDoctors.Update(record);

            // make request for access to doctor profile
            var accessRequest = await dbContext.PatientProfileAccesses.Where(pa => pa.DoctorId == details.doctorId && pa.PatientId == details.patientId).FirstOrDefaultAsync();
            if (accessRequest is null)
            {
                accessRequest = new PatientProfileAccess()
                {
                    PatientId = details.patientId,
                    DoctorId = details.doctorId,
                    Status = (int)Status.PENDING,
                    ApprovalCode = Guid.NewGuid().ToString()
                };
                await dbContext.PatientProfileAccesses.AddAsync(accessRequest);
            }
            else
            {
                accessRequest.Status = (int)Status.PENDING;
                accessRequest.ApprovalCode = Guid.NewGuid().ToString();
                dbContext.PatientProfileAccesses.Update(accessRequest);
            }

            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    // REJECT REQUEST TO BE PERSONAL DOCTOR
    /// <summary>Reject a request to be a personal doctor.</summary>
    /// <param name="details">The details of the request.</param>
    /// <returns>A response indicating whether the request was rejected successfully.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_PATIENT_ROLE)]
    [HttpPost("personal/requests/reject")]
    public async Task<IActionResult> RejectRequestToBePersonalDoctor(ApproveRejectRequestToBePersonalDoctor details)
    {
        // check for any null or empty values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // find record
            var record = await dbContext.PatientDoctors.Where(p => p.PatientId == details.patientId && p.DoctorId == details.doctorId).FirstOrDefaultAsync();
            if (record is null)
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });

            // check for correct approval code
            if (record.ApprovalCode != details.approvalCode)
                return StatusCode(403, new Response { errorMessage = "Wrong approval code!", data = "" });

            // edit record
            record.Status = (int)Status.REJECTED;      // set state to rejected

            // update record
            dbContext.PatientDoctors.Update(record);

            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   GET ALL A DOCTOR'S PATIENTS   ---
    /// <summary>Retrieves all patients of a doctor.</summary>
    /// <param name="doctorId">The doctor's id.</param>
    /// <returns>A list of patients.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpGet("patients")]
    public async Task<IActionResult> GetAllPatients([FromQuery][Required] int doctorId)
    {
        try
        {
            var patients = await (
                from user in dbContext.UserAccounts
                join patient in dbContext.PatientProfiles on user.UserId equals patient.UserId
                join pd in dbContext.PatientDoctors on patient.UserId equals pd.PatientId
                where pd.DoctorId == doctorId && pd.Status == (int)Status.APPROVED
                select new
                {
                    userId = user.UserId,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    profilePicPath = user.ProfilePicPath
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = patients });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }

    //---   GET DOCTOR REVIEWS   ---
    /// <summary>Retrieves the reviews of a doctor.</summary>
    /// <param name="doctorId">The doctor's id.</param>
    /// <returns>The reviews of the doctor.</returns>
    [HttpGet("reviews/{doctorId}")]
    public async Task<IActionResult> GetDoctorReviews(int doctorId)
    {
        try
        {
            var reviews = await (
                from r in dbContext.DoctorReviews
                join u in dbContext.UserAccounts on r.PatientId equals u.UserId
                where r.DoctorId == doctorId
                orderby r.ReviewDate descending
                select new
                {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.ProfilePicPath,

                    r.ReviewId,
                    r.Comment,
                    r.Rating,
                    r.ReviewDate
                }
            ).ToListAsync();
            return Ok(new Response { errorMessage = "", data = reviews });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }

    //---   ADD REVIEW   ---
    /// <summary>Adds a review to a doctor.</summary>
    /// <param name="details">The details of the review.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("review")]
    public async Task<IActionResult> AddReview(AddDoctorReviewRequest details)
    {
        // check for any null or empty values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        // check if doctor exists
        if (!(await dbContext.DoctorProfiles.AnyAsync(d => d.UserId == details.doctorId)))
            return NotFound(new Response { errorMessage = "Doctor not found", data = "" });

        // check if patient exists
        if (!(await dbContext.PatientProfiles.AnyAsync(p => p.UserId == details.patientId)))
            return NotFound(new Response { errorMessage = "Patient not found", data = "" });

        try
        {
            // check if rating out of range
            if (details.rating > 5 || details.rating < 0)
                return BadRequest(new Response { errorMessage = "Patient not found", data = "" });

            // create new review
            var review = new DoctorReview()
            {
                DoctorId = details.doctorId,
                PatientId = details.patientId,
                Comment = details.comment,
                Rating = details.rating
            };

            // add to database
            await dbContext.DoctorReviews.AddAsync(review);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(AddReview), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   DELETE REVIEW   ---
    /// <summary>Deletes a review.</summary>
    /// <param name="reviewId">The ID of the review to delete.</param>
    /// <returns>An IActionResult.</returns>
    [HttpDelete("review/{reviewId}")]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        try
        {
            // check if record exists
            var review = await dbContext.DoctorReviews.Where(r => r.ReviewId == reviewId).FirstOrDefaultAsync();
            if (review is null)
                return NotFound(new Response { errorMessage = "Record not found", data = "" });

            // delete record
            dbContext.DoctorReviews.Remove(review);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   SEARCH DOCTORS   ---
    /// <summary>Search for doctors.</summary>
    /// <param name="query">The query.</param>
    /// <returns>The search results.</returns>
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search([FromQuery] SearchDoctorsQuery query)
    {
        try
        {
            // convert all query string values to lowercase
            BaseRequest.toLowerAllStrings(query);

            /*
                When a query param is not included, its value in the query object will be null.
                If a query value is null, the doctor value will be used in the comparison instead 
                which will result in a match.

                All string comparisons are done in lowercase and use the contains function to match 
                strings that have the query value anywhere within the string 
            */
            var doctors = await (
                from user in dbContext.UserAccounts
                join doc in dbContext.DoctorProfiles on user.UserId equals doc.UserId
                join specialty in dbContext.DoctorSpecialties on doc.SpecialtyId equals specialty.SpecialtyId
                where
                doc.SpecialtyId == (query.specialtyId ?? doc.SpecialtyId)
                && user.FirstName.ToLower().Contains((query.firstName ?? user.FirstName.ToLower()))
                && user.LastName.ToLower().Contains((query.lastName ?? user.LastName.ToLower()))
                && user.Email.ToLower().Contains((query.email ?? user.Email.ToLower()))
                && (doc.Nationality ?? "").ToLower().Contains((query.nationality ?? (doc.Nationality ?? "").ToLower()))
                && (doc.PracticeCity ?? "").ToLower().Contains((query.city ?? (doc.PracticeCity ?? "").ToLower()))
                select new
                {
                    user.UserId,
                    user.ProfilePicPath,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    specialty.SpecialtyId,
                    specialty.SpecialtyName,

                    rating = dbContext.DoctorReviews.Where(r => r.DoctorId == doc.UserId).Average(r => r.Rating) ?? 0,
                    numberOfReviews = dbContext.DoctorReviews.Where(r => r.DoctorId == doc.UserId).Count(),

                    location = $"{doc.PracticeCity}, {doc.PracticeCountry}",
                    appointmentPrice = doc.AppointmentPrice ?? 0
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = doctors });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500);
        }
    }
}