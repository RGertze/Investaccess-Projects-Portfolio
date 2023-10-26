using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Helpers.Enums;
using iPulse_back_end.Models;
using iPulse_back_end.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using SignalRWebpack.Hubs;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PatientController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IBaseService<int, AddPatientNextOfKin, EditPatientNextOfKin> nextOfKinService;
    private IMailHandler mailHandler;
    private IHubContext<NotificationsHub> notifyHubContext;
    private JsonSerializerOptions jsonSerializerOptions;

    public PatientController(IConfiguration configuration, IPulseContext context, IBaseService<int, AddPatientNextOfKin, EditPatientNextOfKin> nextOfKinService, IMailHandler mailHandler, IHubContext<NotificationsHub> notifyHubContext)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.nextOfKinService = nextOfKinService;
        this.mailHandler = mailHandler;
        this.notifyHubContext = notifyHubContext;
        this.jsonSerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    // GET BLOOD TYPES
    /// <summary>Retrieves the list of blood types.</summary>
    /// <returns>The list of blood types.</returns>
    [HttpGet("blood-types")]
    public async Task<IActionResult> GetBloodTypes()
    {
        try
        {
            // get blood types
            var bloodTypes = await (
                from b in dbContext.BloodTypes
                select new
                {
                    b.BloodTypeId,
                    b.BloodTypeName
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = bloodTypes });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    // GET GENDERS
    /// <summary>Retrieves the genders from the database.</summary>
    /// <returns>The genders from the database.</returns>
    [HttpGet("genders")]
    public async Task<IActionResult> GetGenders()
    {
        try
        {
            // get genders
            var genders = await (
                from g in dbContext.Genders
                select new
                {
                    g.GenderId,
                    g.GenderName
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = genders });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    // GET PATIENT PROFILE
    /// <summary>Retrieves a patient's profile.</summary>
    /// <param name="id">The patient's ID.</param>
    /// <returns>The patient's profile.</returns>
    [HttpGet("profile/{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            // get patient profile
            var profile = await (
                from p in dbContext.PatientProfiles
                join m in dbContext.MedicalAidSchemes on p.MedicalAidSchemeId equals m.MedicalAidSchemeId
                where p.UserId == id
                select new
                {
                    m.MedicalAidSchemeName,
                    p.IdNumber,
                    p.MemberNumber,
                    p.Nationality,
                    p.ResidentialAddress,
                    p.PostalAddress,
                    p.Age,
                    gender = p.GenderId,
                    bloodType = p.BloodTypeId,
                    p.SecondaryCellphone
                }).FirstOrDefaultAsync();
            if (profile is null)
            {
                return NotFound(new Response { errorMessage = "Patient profile not found!", data = "" });
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

    // UPDATE PATIENT PROFILE
    /// <summary>Updates a patient's profile.</summary>
    /// <param name="details">The details of the patient's profile.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("profile/update")]
    public async Task<IActionResult> UpdatePatientProfile(PatientProfileUpdateRequest details)
    {
        try
        {
            // get patient profile
            var profile = await dbContext.PatientProfiles.Where(p => p.UserId == details.UserId).FirstOrDefaultAsync();
            if (profile is null)
            {
                return NotFound(new Response { errorMessage = "Patient profile not found!", data = "" });
            }

            // update profile values
            profile.MedicalAidSchemeId = (profile.MedicalAidSchemeId == details.MedicalAidSchemeId || details.MedicalAidSchemeId is null) ? profile.MedicalAidSchemeId : (int)details.MedicalAidSchemeId;
            profile.IdNumber = (profile.IdNumber == details.IdNumber || details.IdNumber is null) ? profile.IdNumber : details.IdNumber;
            profile.MemberNumber = (profile.MemberNumber == details.MemberNumber || details.MemberNumber is null) ? profile.MemberNumber : details.MemberNumber;
            profile.Nationality = (profile.Nationality == details.Nationality || details.Nationality is null) ? profile.Nationality : details.Nationality;
            profile.ResidentialAddress = (profile.ResidentialAddress == details.ResidentialAddress || details.ResidentialAddress is null) ? profile.ResidentialAddress : details.ResidentialAddress;
            profile.PostalAddress = (profile.PostalAddress == details.PostalAddress || details.PostalAddress is null) ? profile.PostalAddress : details.PostalAddress;
            profile.Age = (profile.Age == details.Age || details.Age is null) ? profile.Age : (int)details.Age;
            profile.GenderId = (profile.GenderId == details.Gender || details.Gender is null) ? profile.GenderId : (int)details.Gender;
            profile.BloodTypeId = (profile.BloodTypeId == details.BloodType || details.BloodType is null) ? profile.BloodTypeId : (int)details.BloodType;
            profile.SecondaryCellphone = (profile.SecondaryCellphone == details.SecondaryCellphone || details.SecondaryCellphone is null) ? profile.SecondaryCellphone : details.SecondaryCellphone;

            // update db
            dbContext.PatientProfiles.Update(profile);
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

    // GET PROFILE FOR DOCTOR
    /// <summary>Retrieves the profile of a patient.</summary>
    /// <param name="patientId">The patient's ID.</param>
    /// <param name="doctorId">The doctor's ID.</param>
    /// <returns>The patient's profile.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the application isn't in foreground.</exception>
    /// <exception cref="NotFoundException">Thrown when the patient or doctor is not found.</exception>
    /// <exception cref="ForbiddenException">Thrown when the user is not authorized to view the profile.</exception>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpGet("profile/access")]
    public async Task<IActionResult> GetProfileForDoctor([FromQuery][Required] int patientId, [FromQuery][Required] int doctorId)
    {
        try
        {
            // check if doctor exists
            if (!(await dbContext.UserAccounts.AnyAsync(u => u.UserId == doctorId && u.UserTypeId == 2)))
            {
                return NotFound(new Response { errorMessage = "Doctor not found!", data = "" });
            }

            // check if patient exists
            if (!(await dbContext.UserAccounts.AnyAsync(u => u.UserId == patientId && u.UserTypeId == 3)))
            {
                return NotFound(new Response { errorMessage = "Patient not found!", data = "" });
            }

            // check if doctor has access to profile exists
            if (!(await dbContext.PatientProfileAccesses.AnyAsync(
                p => p.DoctorId == doctorId && p.PatientId == patientId && p.Status == (int)Status.APPROVED
            )))
            {
                return StatusCode(403, new Response { errorMessage = "Not authorized to view profile!", data = "" });
            }

            // get patient profile
            var profile = await (
                from p in dbContext.PatientProfiles
                join m in dbContext.MedicalAidSchemes on p.MedicalAidSchemeId equals m.MedicalAidSchemeId
                join g in dbContext.Genders on p.GenderId equals g.GenderId into subGender
                from subG in subGender.DefaultIfEmpty()
                join b in dbContext.BloodTypes on p.BloodTypeId equals b.BloodTypeId into subBloodType
                from subB in subBloodType.DefaultIfEmpty()
                where p.UserId == patientId
                select new
                {
                    m.MedicalAidSchemeName,
                    p.IdNumber,
                    p.MemberNumber,
                    p.Nationality,
                    p.ResidentialAddress,
                    p.PostalAddress,
                    p.Age,
                    gender = subG.GenderName ?? "",
                    bloodType = subB.BloodTypeName ?? "",
                    p.SecondaryCellphone
                }).FirstOrDefaultAsync();
            if (profile is null)
            {
                return NotFound(new Response { errorMessage = "Patient profile not found!", data = "" });
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

    #region Profile access

    // GET PROFILE ACCESS STATUS FOR DOCTOR
    /// <summary>Retrieves the access status of a patient's profile.</summary>
    /// <param name="patientId">The ID of the patient.</param>
    /// <param name="doctorId">The ID of the doctor.</param>
    /// <returns>The access status of the patient's profile.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpGet("profile/access/check")]
    public async Task<IActionResult> GetProfileAccessStatusForDoctor([FromQuery][Required] int patientId, [FromQuery][Required] int doctorId)
    {
        try
        {
            // get access request
            var accessRequest = await (
                from pa in dbContext.PatientProfileAccesses
                where pa.DoctorId == doctorId && pa.PatientId == patientId
                select new
                {
                    pa.Status
                }).FirstOrDefaultAsync();
            if (accessRequest is null)
            {
                return NotFound(new Response { errorMessage = "Access record not found!", data = "" });
            }

            return Ok(new Response { errorMessage = "", data = accessRequest });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve access record!", data = "" });
        }
    }

    // REQUEST PATIENT PROFILE ACCESS
    /// <summary>Requests access to a patient's profile.</summary>
    /// <param name="details">The details of the request.</param>
    /// <returns>A response indicating whether the request was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_ROLE)]
    [HttpPost("profile/access")]
    public async Task<IActionResult> RequestProfileAccess(ProfileAccessRequest details)
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
            var profileAccess = await dbContext.PatientProfileAccesses.Where(p => p.PatientId == details.patientId && p.DoctorId == details.doctorId).FirstOrDefaultAsync();

            if (profileAccess is null)
            {
                // create new record if it doesnt exist
                profileAccess = new PatientProfileAccess
                {
                    DoctorId = details.doctorId,
                    PatientId = details.patientId,
                    ApprovalCode = Guid.NewGuid().ToString(),
                    Status = (int)Status.PENDING                  // set state to pending
                };

                // add record
                await dbContext.PatientProfileAccesses.AddAsync(profileAccess);
            }
            else
            {
                // edit existing record
                profileAccess.ApprovalCode = Guid.NewGuid().ToString();
                profileAccess.Status = (int)Status.PENDING;      // set state to pending

                // update record
                dbContext.PatientProfileAccesses.Update(profileAccess);
            }

            await dbContext.SaveChangesAsync();

            var patient = await dbContext.UserAccounts.Where(u => u.UserId == details.patientId).FirstOrDefaultAsync();
            var doctor = await dbContext.UserAccounts.Where(u => u.UserId == details.doctorId).FirstOrDefaultAsync();

            // return without sending email if for whatever reason patient or doctor is null
            if (patient is null || doctor is null)
            {
                return CreatedAtAction(nameof(RequestProfileAccess), new Response { errorMessage = "", data = new { message = "success" } });
            }

            // create notification
            Notification notification = new Notification()
            {
                TypeId = 3,
                UserId = details.patientId,
                Content = JsonSerializer.Serialize(new
                {
                    doctor.UserId,
                    doctor.Email,
                    doctor.FirstName,
                    doctor.LastName,
                    profileAccess.Status
                }, jsonSerializerOptions)
            };
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{details.patientId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });


            // build email
            string baseUrl = HtmlBuilder.BaseUrl;
            var tuples = new List<Tuple<string, string>>(){
                new("{rejectUrl}",baseUrl+$"/api/parent/profile/access/reject?patientId={profileAccess.PatientId}&doctorId={profileAccess.DoctorId}&approvalCode={profileAccess.ApprovalCode}"),
                new("{approveUrl}",baseUrl+$"/api/parent/profile/access/approve?patientId={profileAccess.PatientId}&doctorId={profileAccess.DoctorId}&approvalCode={profileAccess.ApprovalCode}"),
                new("{name}",$"{doctor.FirstName} {doctor.LastName}"),
                new("{email}",$"{doctor.Email}")
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/profileAccessRequestedEmail.html", tuples);

            // send email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Ipulse Mailer", configuration["MailSettings:Username"]));
            message.To.Add(new MailboxAddress(patient.FirstName + " " + patient.LastName, patient.Email));
            message.Body = new TextPart("html")
            {
                Text = htmlString
            };

            this.mailHandler.sendMessage(message);

            return CreatedAtAction(nameof(RequestProfileAccess), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    // GET PROFILE ACCESS REQUESTS
    /// <summary>Retrieves the access requests for a patient.</summary>
    /// <param name="id">The patient's ID.</param>
    /// <returns>The access requests for the patient.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("profile/access/requests/{id}")]
    public async Task<IActionResult> GetProfileAccessRequests(int id)
    {
        try
        {
            // check if patient exists
            if (!(await dbContext.PatientProfiles.AnyAsync(p => p.UserId == id)))
                return NotFound(new Response { errorMessage = "Patient not found!", data = "" });

            // get access requests
            var accessRequests = await (
                from pa in dbContext.PatientProfileAccesses
                join d in dbContext.UserAccounts on pa.DoctorId equals d.UserId
                where pa.PatientId == id && pa.Status == (int)Status.PENDING
                select new
                {
                    pa.PatientId,
                    pa.DoctorId,
                    pa.ApprovalCode,
                    d.Email,
                    d.FirstName,
                    d.LastName,
                    d.ProfilePicPath
                }).ToListAsync();

            return Ok(new Response { errorMessage = "", data = accessRequests });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve access record!", data = "" });
        }
    }

    // APPROVE PATIENT PROFILE ACCESS
    /// <summary>Approve a profile access request.</summary>
    /// <param name="details">The details of the request.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("profile/access/approve")]
    public async Task<IActionResult> ApproveProfileAccess(ApproveRejectProfileAccessRequest details)
    {
        // check for any null or empty values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // find record
            var profileAccess = await dbContext.PatientProfileAccesses.Where(p => p.PatientId == details.patientId && p.DoctorId == details.doctorId).FirstOrDefaultAsync();
            if (profileAccess is null)
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });

            // check for correct approval code
            if (profileAccess.ApprovalCode != details.approvalCode)
                return StatusCode(403, new Response { errorMessage = "Wrong approval code!", data = "" });

            // edit record
            profileAccess.Status = (int)Status.APPROVED;      // set state to approved

            // update record
            dbContext.PatientProfileAccesses.Update(profileAccess);

            await dbContext.SaveChangesAsync();

            // get patient
            var patient = await dbContext.UserAccounts.Where(u => u.UserId == details.patientId).Select(u => new
            {
                u.UserId,
                u.Email,
                u.FirstName,
                u.LastName
            }).FirstAsync();

            // create notification
            Notification notification = new Notification()
            {
                TypeId = 3,
                UserId = details.doctorId,
                Content = JsonSerializer.Serialize(new
                {
                    patient.UserId,
                    patient.Email,
                    patient.FirstName,
                    patient.LastName,
                    profileAccess.Status
                }, jsonSerializerOptions)
            };
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{details.doctorId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    // APPROVE PATIENT PROFILE ACCESS VIA EMAIL
    /// <summary>Approve a patient's profile access via email.</summary>
    /// <param name="patientId">The patient's id.</param>
    /// <param name="doctorId">The doctor's id.</param>
    /// <param name="approvalCode">The approval code.</param>
    /// <returns>A response object.</returns>
    [AllowAnonymous]
    [HttpGet("profile/access/approve")]
    public async Task<IActionResult> ApproveProfileAccessViaEmail([FromQuery][Required] int patientId, [FromQuery][Required] int doctorId, [FromQuery][Required] string approvalCode)
    {
        try
        {
            // find record
            var profileAccess = await dbContext.PatientProfileAccesses.Where(p => p.PatientId == patientId && p.DoctorId == doctorId).FirstOrDefaultAsync();
            if (profileAccess is null)
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });

            // check for correct approval code
            if (profileAccess.ApprovalCode != approvalCode)
                return StatusCode(403, new Response { errorMessage = "Wrong approval code!", data = "" });

            // edit record
            profileAccess.Status = (int)Status.APPROVED;      // set state to approved

            // update record
            dbContext.PatientProfileAccesses.Update(profileAccess);

            await dbContext.SaveChangesAsync();

            // get patient
            var patient = await dbContext.UserAccounts.Where(u => u.UserId == patientId).Select(u => new
            {
                u.UserId,
                u.Email,
                u.FirstName,
                u.LastName
            }).FirstAsync();

            // create notification
            Notification notification = new Notification()
            {
                TypeId = 3,
                UserId = profileAccess.DoctorId,
                Content = JsonSerializer.Serialize(new
                {
                    patient.UserId,
                    patient.Email,
                    patient.FirstName,
                    patient.LastName,
                    profileAccess.Status
                }, jsonSerializerOptions)
            };
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{profileAccess.DoctorId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    // REJECT PATIENT PROFILE ACCESS VIA EMAIL
    /// <summary>Rejects a profile access request via email.</summary>
    /// <param name="patientId">The patient's id.</param>
    /// <param name="doctorId">The doctor's id.</param>
    /// <param name="approvalCode">The approval code.</param>
    /// <returns>A response object.</returns>
    [AllowAnonymous]
    [HttpGet("profile/access/reject")]
    public async Task<IActionResult> RejectProfileAccessViaEmail([FromQuery][Required] int patientId, [FromQuery][Required] int doctorId, [FromQuery][Required] string approvalCode)
    {
        try
        {
            // find record
            var profileAccess = await dbContext.PatientProfileAccesses.Where(p => p.PatientId == patientId && p.DoctorId == doctorId).FirstOrDefaultAsync();
            if (profileAccess is null)
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });

            // check for correct approval code
            if (profileAccess.ApprovalCode != approvalCode)
                return StatusCode(403, new Response { errorMessage = "Wrong approval code!", data = "" });

            // edit record
            profileAccess.Status = (int)Status.REJECTED;      // set state to rejected

            // update record
            dbContext.PatientProfileAccesses.Update(profileAccess);

            await dbContext.SaveChangesAsync();

            // get patient
            var patient = await dbContext.UserAccounts.Where(u => u.UserId == patientId).Select(u => new
            {
                u.UserId,
                u.Email,
                u.FirstName,
                u.LastName
            }).FirstAsync();

            // create notification
            Notification notification = new Notification()
            {
                TypeId = 3,
                UserId = profileAccess.DoctorId,
                Content = JsonSerializer.Serialize(new
                {
                    patient.UserId,
                    patient.Email,
                    patient.FirstName,
                    patient.LastName,
                    profileAccess.Status
                }, jsonSerializerOptions)
            };
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{profileAccess.DoctorId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    // REJECT PATIENT PROFILE ACCESS
    /// <summary>Rejects a patient's profile access request.</summary>
    /// <param name="details">The details of the request.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("profile/access/reject")]
    public async Task<IActionResult> RejectProfileAccess(ApproveRejectProfileAccessRequest details)
    {
        // check for any null or empty values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // find record
            var profileAccess = await dbContext.PatientProfileAccesses.Where(p => p.PatientId == details.patientId && p.DoctorId == details.doctorId).FirstOrDefaultAsync();
            if (profileAccess is null)
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });

            // check for correct approval code
            if (profileAccess.ApprovalCode != details.approvalCode)
                return StatusCode(403, new Response { errorMessage = "Wrong approval code!", data = "" });

            // edit record
            profileAccess.Status = (int)Status.REJECTED;      // set state to rejected

            // update record
            dbContext.PatientProfileAccesses.Update(profileAccess);

            await dbContext.SaveChangesAsync();

            // get patient
            var patient = await dbContext.UserAccounts.Where(u => u.UserId == details.patientId).Select(u => new
            {
                u.UserId,
                u.Email,
                u.FirstName,
                u.LastName
            }).FirstAsync();

            // create notification
            Notification notification = new Notification()
            {
                TypeId = 3,
                UserId = profileAccess.DoctorId,
                Content = JsonSerializer.Serialize(new
                {
                    patient.UserId,
                    patient.Email,
                    patient.FirstName,
                    patient.LastName,
                    profileAccess.Status
                }, jsonSerializerOptions)
            };
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{details.doctorId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //----   GET DOCTORS WITH PROFILE ACCESS   ----
    /// <summary>Retrieves the list of doctors with profile access.</summary>
    /// <param name="patientId">The patient's ID.</param>
    /// <returns>The list of doctors with profile access.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("profile/access/all/{patientId}")]
    public async Task<IActionResult> GetDoctorsWithProfileAccess(int patientId)
    {
        try
        {
            // get doctors
            var doctors = await (
                from user in dbContext.UserAccounts
                join doc in dbContext.DoctorProfiles on user.UserId equals doc.UserId
                join specialty in dbContext.DoctorSpecialties on doc.SpecialtyId equals specialty.SpecialtyId
                join pd in dbContext.PatientProfileAccesses on doc.UserId equals pd.DoctorId
                where pd.PatientId == patientId && pd.Status == (int)Status.APPROVED
                select new
                {
                    pd.ApprovalCode,

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
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    //----   REVOKE PATIENT PROFILE ACCESS   ----
    /// <summary>Revokes the access of a patient to a doctor's profile.</summary>
    /// <param name="details">The details of the request.</param>
    /// <returns>A response indicating whether the request was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("profile/access/revoke")]
    public async Task<IActionResult> RevokeProfileAccess(ApproveRejectProfileAccessRequest details)
    {
        // check for any null or empty values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            // find record
            var profileAccess = await dbContext.PatientProfileAccesses.Where(p => p.PatientId == details.patientId && p.DoctorId == details.doctorId).FirstOrDefaultAsync();
            if (profileAccess is null)
                return NotFound(new Response { errorMessage = "Record not found!", data = "" });

            // check for correct approval code
            if (profileAccess.ApprovalCode != details.approvalCode)
                return StatusCode(403, new Response { errorMessage = "Wrong approval code!", data = "" });

            // edit record
            profileAccess.Status = (int)Status.REJECTED;      // set state to rejected

            // update record
            dbContext.PatientProfileAccesses.Update(profileAccess);
            await dbContext.SaveChangesAsync();

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

    // GET DOCTORS FOR A PATIENT
    /// <summary>Retrieves the doctors for a patient.</summary>
    /// <param name="patientId">The patient's ID.</param>
    /// <returns>The doctors for the patient.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("doctors/{patientId}")]
    public async Task<IActionResult> GetDoctorsForAPatient(int patientId)
    {
        try
        {
            // get doctors
            var doctors = await (
                from user in dbContext.UserAccounts
                join doc in dbContext.DoctorProfiles on user.UserId equals doc.UserId
                join specialty in dbContext.DoctorSpecialties on doc.SpecialtyId equals specialty.SpecialtyId
                join pd in dbContext.PatientDoctors on doc.UserId equals pd.DoctorId
                where pd.PatientId == patientId && pd.Status == (int)Status.APPROVED
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
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    //---   SEARCH DOCTORS   ---
    /// <summary>Search for patients.</summary>
    /// <param name="query">The query.</param>
    /// <returns>The patients that match the query.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchPatientQuery query)
    {
        try
        {
            // convert all query string values to lowercase
            BaseRequest.toLowerAllStrings(query);

            // get patients matching query values
            var patients = await (
                from user in dbContext.UserAccounts
                join patient in dbContext.PatientProfiles on user.UserId equals patient.UserId
                where user.FirstName.ToLower().Contains((query.firstName ?? ""))
                && user.LastName.ToLower().Contains((query.lastName ?? ""))
                && user.Email.ToLower().Contains((query.email ?? ""))
                select new
                {
                    user.UserId,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.ProfilePicPath
                }).ToListAsync();

            // filter for doctor if id specified 
            if (query.doctorId is not null)
            {
                patients = (
                    from p in patients
                    join pd in dbContext.PatientDoctors on p.UserId equals pd.PatientId
                    where pd.DoctorId == query.doctorId && pd.Status == (int)Status.APPROVED
                    select p
                ).ToList();
                patients.ForEach(p => Console.WriteLine(JsonSerializer.Serialize(p)));
            }


            return Ok(new Response { errorMessage = "", data = patients });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    #region Patient next of kin

    // GET NEXT OF KIN
    /// <summary>Retrieves the next of kin of a patient.</summary>
    /// <param name="patientId">The patient's id.</param>
    /// <returns>The next of kin of the patient.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_PATIENT_ROLE)]
    [HttpGet("next-of-kin/{patientId}")]
    public async Task<IActionResult> GetNextOfKin(int patientId)
    {
        try
        {
            var nextOfKin = await nextOfKinService.GetAllBy(patientId);

            if (nextOfKin.errorMessage != "")
            {
                return StatusCode(nextOfKin.data, nextOfKin);
            }

            return Ok(nextOfKin);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    // ADD PATIENT NEXT OF KIN
    /// <summary>Adds a patient's next of kin.</summary>
    /// <param name="details">The details of the next of kin.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("next-of-kin")]
    public async Task<IActionResult> AddPatientNextOfKin(AddPatientNextOfKin details)
    {
        try
        {
            var response = await nextOfKinService.Add(details);

            if (response.errorMessage != "")
            {
                return StatusCode(response.data, response);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to add next of kin!", data = "" });
        }
    }

    // Edit PATIENT NEXT OF KIN
    /// <summary>Edits a patient's next of kin.</summary>
    /// <param name="details">The details of the next of kin.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost("next-of-kin/edit")]
    public async Task<IActionResult> AddPatientNextOfKin(EditPatientNextOfKin details)
    {
        try
        {
            var response = await nextOfKinService.Edit(details);

            if (response.errorMessage != "")
            {
                return StatusCode(response.data, response);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to edit next of kin!", data = "" });
        }
    }

    // DELETE PATIENT NEXT OF KIN
    /// <summary>Deletes a patient's next of kin.</summary>
    /// <param name="id">The patient's next of kin's id.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpDelete("next-of-kin/{id}")]
    public async Task<IActionResult> DeletePatientNextOfKin(int id)
    {
        try
        {
            var response = await nextOfKinService.Delete(id);

            if (response.errorMessage != "")
            {
                return StatusCode(response.data, response);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to delete data. Try again later.", data = "" });
        }
    }

    #endregion
}





