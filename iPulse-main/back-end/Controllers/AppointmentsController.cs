using System.Reflection.Metadata.Ecma335;
using System.Text.Json;
using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Helpers.Enums;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using MimeKit;
using SignalRWebpack.Hubs;

namespace iPulse_back_end.Controllers;

/// <summary>Handles appointment requests</summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IMailHandler mailHandler;
    private IHubContext<NotificationsHub> notifyHubContext;
    private JsonSerializerOptions jsonSerializerOptions;

    public AppointmentsController(IConfiguration configuration, IPulseContext context, IMailHandler mailHandler, IHubContext<NotificationsHub> notifyHubContext)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.mailHandler = mailHandler;
        this.notifyHubContext = notifyHubContext;
        this.jsonSerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    /// <summary>Retrieves an appointment using its ID and confirmation code.</summary>
    /// <param name="id">The ID of the appointment.</param>
    /// <param name="code">The confirmation code of the appointment.</param>
    /// <returns>The appointment with the specified ID and confirmation code.</returns>
    // GET APPOINTMENT USING CODE
    [AllowAnonymous]
    [HttpGet("single")]
    public async Task<IActionResult> GetAppointmentUsingCode(int id, string code)
    {
        try
        {
            var appointment = await (
                from ap in dbContext.Appointments
                join patient in dbContext.UserAccounts on ap.PatientId equals patient.UserId
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                where ap.AppointmentId == id
                select new
                {
                    ap.AppointmentId,
                    slot.DoctorId,
                    ap.PatientId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,
                    ap.ConfirmationCode,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm"),

                    patientFirstname = patient.FirstName,
                    patientLastname = patient.LastName,
                    patientEmail = patient.Email,
                    patientProfilePic = patient.ProfilePicPath
                }
            ).FirstOrDefaultAsync();
            if (appointment is null)
            {
                return NotFound(new Response { errorMessage = "Appointment not found", data = "" });
            }
            if (appointment.ConfirmationCode != code)
            {
                return StatusCode(403, new Response { errorMessage = "Appointment code is incorrect", data = "" });
            }
            return Ok(new Response { errorMessage = "", data = appointment });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }

    /// <summary>Retrieves all appointments.</summary>
    /// <returns>A list of appointments.</returns>
    /// <exception cref="Exception">Thrown when an error occured while trying to retrieve data.</exception>
    // GET ALL APPOINTMENTS
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet()]
    public async Task<IActionResult> Get()
    {
        try
        {
            var appointments = await (
                from ap in dbContext.Appointments
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                join doctor in dbContext.UserAccounts on slot.DoctorId equals doctor.UserId
                join patient in dbContext.UserAccounts on ap.PatientId equals patient.UserId
                select new
                {
                    ap.AppointmentId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm"),

                    doctorEmail = doctor.Email,
                    doctorName = $"{doctor.FirstName} {doctor.LastName}",
                    doctorProfilePicPath = doctor.ProfilePicPath,

                    patientEmail = patient.Email,
                    patientName = $"{patient.FirstName} {patient.LastName}",
                    patientProfilePicPath = patient.ProfilePicPath,
                }
            ).ToListAsync();
            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }

    /// <summary>Retrieves all appointments of a doctor.</summary>
    /// <param name="id">The doctor's id.</param>
    /// <returns>A list of appointments.</returns>
    // GET ALL APPOINTMENTS FOR DOCTOR
    [HttpGet("doctor/{id}")]
    public async Task<IActionResult> GetAllDoctorAppointments(int id)
    {
        try
        {

            var appointments = await (
                from appointment in dbContext.Appointments
                join patient in dbContext.UserAccounts on appointment.PatientId equals patient.UserId
                join slot in dbContext.AppointmentSlots on appointment.SlotId equals slot.SlotId
                where slot.DoctorId == id && appointment.Status != (int)Status.REJECTED && appointment.Status != (int)Status.CANCELLED
                select new
                {
                    appointment.AppointmentId,
                    slot.DoctorId,
                    appointment.PatientId,
                    appointment.Title,
                    appointment.Description,
                    date = appointment.DateOf.ToString("dd/MM/yyyy"),
                    appointment.Status,
                    appointment.ConfirmationCode,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm"),

                    patientFirstname = patient.FirstName,
                    patientLastname = patient.LastName,
                    patientEmail = patient.Email,
                    patientProfilePic = patient.ProfilePicPath
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    /// <summary>Retrieves all appointments of a patient.</summary>
    /// <param name="id">The patient's id.</param>
    /// <returns>A list of appointments.</returns>
    // GET ALL APPOINTMENTS FOR PATIENT
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("patient/{id}")]
    public async Task<IActionResult> GetAllPatientAppointments(int id)
    {
        try
        {
            var appointments = await (
                from ap in dbContext.Appointments
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                where ap.PatientId == id
                select new
                {
                    ap.AppointmentId,
                    slot.DoctorId,
                    ap.PatientId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm")
                }
            ).ToListAsync();
            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    /// <summary>Retrieves the upcoming appointments of a patient.</summary>
    /// <param name="patientId">The patient's id.</param>
    /// <returns>The upcoming appointments of the patient.</returns>
    // GET UPCOMING APPOINTMENTS
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("patient/upcoming/{patientId}")]
    public async Task<IActionResult> GetUpcomingAppointments(int patientId)
    {
        try
        {
            // check if patient exists
            if (!(await dbContext.PatientProfiles.AnyAsync(p => p.UserId == patientId)))
            {
                return NotFound(new Response { errorMessage = "Patient not found", data = "" });
            }

            // get appointments
            var appointments = await (
                from ap in dbContext.Appointments
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                join d in dbContext.UserAccounts on slot.DoctorId equals d.UserId
                where ap.PatientId == patientId && (ap.DateOf.ToDateTime(slot.EndTime).CompareTo(DateTime.Now) >= 0) && ap.Status != (int)Status.REJECTED && ap.Status != (int)Status.CANCELLED  // appointment ends in future
                orderby ap.Status descending, ap.DateOf ascending, slot.StartTime ascending
                select new
                {
                    // doctor values
                    d.UserId,
                    d.FirstName,
                    d.LastName,
                    d.Email,
                    d.ProfilePicPath,

                    // appointment values
                    ap.AppointmentId,
                    slot.DoctorId,
                    ap.PatientId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,
                    ap.ConfirmationCode,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm")
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    // GET APPOINTMENT HISTORY
    /// <summary>Gets the appointment history.</summary>
    /// <returns>The appointment history.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpGet("patient/history/{patientId}")]
    public async Task<IActionResult> GetAppointmentHistory(int patientId)
    {
        try
        {
            // check if patient exists
            if (!(await dbContext.PatientProfiles.AnyAsync(p => p.UserId == patientId)))
            {
                return NotFound(new Response { errorMessage = "Patient not found", data = "" });
            }

            // get appointments
            var appointments = await (
                from ap in dbContext.Appointments
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                join d in dbContext.UserAccounts on slot.DoctorId equals d.UserId
                where ap.PatientId == patientId && ((ap.DateOf.ToDateTime(slot.EndTime).CompareTo(DateTime.Now) < 0) || ap.Status == (int)Status.REJECTED || ap.Status == (int)Status.CANCELLED)  // appointment was in past or was rejected
                orderby ap.DateOf ascending, slot.StartTime ascending
                select new
                {
                    // doctor values
                    d.UserId,
                    d.FirstName,
                    d.LastName,
                    d.Email,
                    d.ProfilePicPath,

                    // appointment values
                    ap.AppointmentId,
                    slot.DoctorId,
                    ap.PatientId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,
                    ap.ConfirmationCode,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm")
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    // GET PENDING APPOINTMENTS FOR DOCTOR
    /// <summary>Retrieves the list of pending appointments for a doctor.</summary>
    /// <param name="doctorId">The doctor's user ID.</param>
    /// <returns>The list of pending appointments for the doctor.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpGet("doctor/pending/{doctorId}")]
    public async Task<IActionResult> GetPendingAppointmentsForDoctor(int doctorId)
    {
        try
        {
            // check if doctor exists
            if (!(await dbContext.DoctorProfiles.AnyAsync(p => p.UserId == doctorId)))
            {
                return NotFound(new Response { errorMessage = "Doctor not found", data = "" });
            }

            // get appointments
            var appointments = await (
                from ap in dbContext.Appointments
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                join p in dbContext.UserAccounts on ap.PatientId equals p.UserId
                where slot.DoctorId == doctorId && ap.Status == (int)Status.PENDING  // appointment ends in future
                orderby ap.DateOf ascending, slot.StartTime ascending
                select new
                {
                    // patient values
                    p.UserId,
                    p.FirstName,
                    p.LastName,
                    p.Email,
                    p.ProfilePicPath,

                    // appointment values
                    ap.AppointmentId,
                    slot.DoctorId,
                    ap.PatientId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,
                    ap.ConfirmationCode,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm")
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    // GET UPCOMING APPOINTMENTS FOR DOCTOR
    /// <summary>Retrieves the upcoming appointments for a doctor.</summary>
    /// <param name="doctorId">The doctor's ID.</param>
    /// <returns>The upcoming appointments for the doctor.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpGet("doctor/upcoming/{doctorId}")]
    public async Task<IActionResult> GetUpcomingAppointmentsForDoctor(int doctorId)
    {
        try
        {
            // check if doctor exists
            if (!(await dbContext.DoctorProfiles.AnyAsync(p => p.UserId == doctorId)))
            {
                return NotFound(new Response { errorMessage = "Doctor not found", data = "" });
            }

            // get appointments
            var appointments = await (
                from ap in dbContext.Appointments
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                join p in dbContext.UserAccounts on ap.PatientId equals p.UserId
                where slot.DoctorId == doctorId && (ap.DateOf.ToDateTime(slot.EndTime).CompareTo(DateTime.Now) >= 0) && ap.Status != (int)Status.REJECTED && ap.Status != (int)Status.CANCELLED && ap.Status != (int)Status.PENDING  // appointment ends in future
                orderby ap.Status descending, ap.DateOf ascending, slot.StartTime ascending
                select new
                {
                    // patient values
                    p.UserId,
                    p.FirstName,
                    p.LastName,
                    p.Email,
                    p.ProfilePicPath,

                    // appointment values
                    ap.AppointmentId,
                    slot.DoctorId,
                    ap.PatientId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,
                    ap.ConfirmationCode,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm")
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }

    // GET APPOINTMENT HISTORY FOR DOCTOR
    /// <summary>Retrieves the appointment history of a doctor.</summary>
    /// <param name="doctorId">The doctor's id.</param>
    /// <returns>The appointment history of the doctor.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpGet("doctor/history/{doctorId}")]
    public async Task<IActionResult> GetAppointmentHistoryForDoctor(int doctorId)
    {
        try
        {
            // check if doctor exists
            if (!(await dbContext.DoctorProfiles.AnyAsync(p => p.UserId == doctorId)))
            {
                return NotFound(new Response { errorMessage = "Doctor not found", data = "" });
            }

            // get appointments
            var appointments = await (
                from ap in dbContext.Appointments
                join slot in dbContext.AppointmentSlots on ap.SlotId equals slot.SlotId
                join p in dbContext.UserAccounts on ap.PatientId equals p.UserId
                where slot.DoctorId == doctorId && ((ap.DateOf.ToDateTime(slot.EndTime).CompareTo(DateTime.Now) < 0) || ap.Status == (int)Status.REJECTED || ap.Status == (int)Status.CANCELLED)  // appointment was in past or was rejected or cancelled
                orderby ap.Status descending, ap.DateOf ascending, slot.StartTime ascending
                select new
                {
                    // patient values
                    p.UserId,
                    p.FirstName,
                    p.LastName,
                    p.Email,
                    p.ProfilePicPath,

                    // appointment values
                    ap.AppointmentId,
                    slot.DoctorId,
                    ap.PatientId,
                    ap.Title,
                    ap.Description,
                    date = ap.DateOf.ToString("dd/MM/yyyy"),
                    ap.Status,
                    ap.ConfirmationCode,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm")
                }
            ).ToListAsync();

            return Ok(new Response { errorMessage = "", data = appointments });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = "Failed to retrieve data!", data = "" });
        }
    }



    // ADD APPOINTMENT
    /// <summary>Creates an appointment.</summary>
    /// <param name="details">The details of the appointment.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_PATIENT_ROLE)]
    [HttpPost]
    public async Task<IActionResult> Create(AddAppointmentRequest details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        try
        {
            // check for valid date
            if (!DateOnly.TryParse(details.date, out DateOnly dateOf))      // create dateOf object here
            {
                return BadRequest(new Response { errorMessage = "Invalid date provided", data = "" });
            }

            // check if slot exists
            var slot = await dbContext.AppointmentSlots.Where(slot => slot.SlotId == details.slotId).FirstOrDefaultAsync();
            if (slot is null)
            {
                return NotFound(new Response { errorMessage = "Slot does not exist", data = "" });
            }

            // get doctor
            var doctor = await dbContext.UserAccounts.Where(u => u.UserId == slot.DoctorId).FirstAsync();

            // check if patient exists
            var patient = await dbContext.UserAccounts.Where(u => u.UserId == details.patientId && u.UserTypeId == 3).FirstOrDefaultAsync();
            if (patient is null)
            {
                return NotFound(new Response { errorMessage = "Patient does not exist", data = "" });
            }

            // check slot conflict on day of appointment
            if (await dbContext.Appointments.Where(ap => ap.DateOf == dateOf && ap.SlotId == slot.SlotId && ap.Status != (int)Status.REJECTED && ap.Status != (int)Status.CANCELLED).AnyAsync())
            {
                return Conflict(new Response { errorMessage = "That slot has been booked!", data = "" });
            }

            // create appointment
            var appointment = new Appointment
            {
                SlotId = slot.SlotId,
                PatientId = details.patientId,
                Title = details.title,
                Description = details.description,
                DateOf = dateOf,
                Status = (int)Status.PENDING,     // set status to pending

                ConfirmationCode = Guid.NewGuid().ToString()    // set confirmation code

            };

            // add user to appointments
            await dbContext.Appointments.AddAsync(appointment);
            await dbContext.SaveChangesAsync();

            // create notification
            Notification notification = new Notification()
            {
                TypeId = 2,
                UserId = doctor.UserId,
                Content = JsonSerializer.Serialize(new
                {
                    appointment.AppointmentId,
                    slot.DoctorId,
                    appointment.PatientId,
                    appointment.Title,
                    appointment.Description,
                    date = appointment.DateOf.ToString("dd/MM/yyyy"),
                    appointment.Status,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm"),

                    patient.FirstName,
                    patient.LastName,
                }, jsonSerializerOptions)
            };

            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{slot.DoctorId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });

            // send approval email to doctor
            SendAppointmentApprovalEmail(doctor, patient, appointment, slot);

            return CreatedAtAction(nameof(Create), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }

    }

    // APPROVE APPOINTMENT
    /// <summary>Approve an appointment.</summary>
    /// <param name="details">The details of the appointment to approve.</param>
    /// <returns>A response indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpPost("approve")]
    public async Task<IActionResult> Approve(AppointmentStatusUpdateRequest details)
    {
        try
        {
            var response = await UpdateAppointmentStatus(details.appointmentId, "", Status.APPROVED);
            if (response.errorMessage.Length == 0)
                return Ok(new Response { errorMessage = "", data = new { message = "success" } });

            return StatusCode(500, new Response { errorMessage = "Unable to approve appointment! Try again later", data = "" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Response { errorMessage = "Unable to approve appointment! Try again later", data = "" });
        }
    }

    // REJECT APPOINTMENT
    /// <summary>Rejects an appointment.</summary>
    /// <param name="details">The details of the appointment to reject.</param>
    /// <returns>A response indicating whether the appointment was rejected successfully.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpPost("reject")]
    public async Task<IActionResult> Reject(AppointmentStatusUpdateRequest details)
    {
        try
        {
            var response = await UpdateAppointmentStatus(details.appointmentId, "", Status.REJECTED);
            if (response.errorMessage.Length == 0)
                return Ok(new Response { errorMessage = "", data = new { message = "success" } });

            return StatusCode(500, new Response { errorMessage = response.errorMessage, data = "" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Response { errorMessage = "Unable to reject appointment! Try again later", data = "" });
        }
    }

    // APPROVE APPOINTMENT VIA EMAIL LINK
    /// <summary>Approves an appointment via an email link.</summary>
    /// <param name="appointmentId">The ID of the appointment.</param>
    /// <param name="code">The code that was sent to the user.</param>
    /// <returns>The result of the operation.</returns>
    [AllowAnonymous]
    [HttpGet("approve/{appointmentId}/{code}")]
    public async Task<IActionResult> ApproveViaEmailLink(int appointmentId, string code)
    {
        var response = await UpdateAppointmentStatus(appointmentId, code, Status.APPROVED);
        if (response.errorMessage.Length == 0)
        {
            return Redirect($"{HtmlBuilder.BaseUrl}/info/appointment/{response.data}/{code}");
        }

        return new ContentResult { Content = HtmlBuilder.buildErrorMessage(response.errorMessage), ContentType = "text/html" };
    }

    // REJECT APPOINTMENT VIA EMAIL LINK
    /// <summary>Rejects the current meeting via email.</summary>
    /// <param name="meetingId">The meeting ID.</param>
    /// <param name="meetingResponse">The meeting response.</param>
    /// <param name="emailAddress">The email address.</param>
    /// <param name="emailSubject">The email subject.</param>
    /// <param name="emailBody">The email body.</param>
    /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
    [AllowAnonymous]
    [HttpGet("reject/{appointmentId}/{code}")]
    public async Task<IActionResult> RejectViaEmailLink(int appointmentId, string code)
    {
        var response = await UpdateAppointmentStatus(appointmentId, code, Status.REJECTED);
        if (response.errorMessage.Length == 0)
        {
            return Redirect($"{HtmlBuilder.BaseUrl}/info/appointment/{response.data}/{code}");
        }

        return new ContentResult { Content = HtmlBuilder.buildErrorMessage(response.errorMessage), ContentType = "text/html" };
    }

    // CANCEL APPOINTMENT
    /// <summary>Cancels an appointment.</summary>
    /// <param name="details">The details of the appointment to cancel.</param>
    /// <returns>A response object indicating whether the appointment was cancelled successfully.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_PATIENT_OR_RECEPTIONIST_ROLE)]
    [HttpPost("cancel")]
    public async Task<IActionResult> Cancel(CancelAppointment details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        try
        {
            // checked if appointment exists
            var appointment = await dbContext.Appointments.Where(ap => ap.AppointmentId == details.appointmentId).FirstOrDefaultAsync();
            if (appointment is null)
            {
                return NotFound(new Response { errorMessage = "Appointment not found", data = "" });
            }
            var slot = await dbContext.AppointmentSlots.Where(aps => aps.SlotId == appointment.SlotId).FirstAsync();

            // check if user is a part of appointment
            if (slot.DoctorId != details.userId && appointment.PatientId != details.userId)
            {
                return BadRequest(new Response { errorMessage = "User not part of appointment", data = "" });
            }

            // set status to cancelled
            var oldStatus = appointment.Status;
            appointment.Status = (int)Status.CANCELLED;

            // update appointment 
            dbContext.Appointments.Update(appointment);
            await dbContext.SaveChangesAsync();

            // send notification to other party if appointment was approved
            if (oldStatus == (int)Status.APPROVED)
            {
                int userToSendNotificationToId = appointment.PatientId;
                if (userToSendNotificationToId == details.userId)
                {
                    userToSendNotificationToId = slot.DoctorId;
                }

                // get user who cancelled
                var userWhoCancelled = await dbContext.UserAccounts.Where(u => u.UserId == details.userId).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstAsync();

                // create notification
                Notification notification = new Notification()
                {
                    TypeId = 2,
                    UserId = userToSendNotificationToId,
                    Content = JsonSerializer.Serialize(new
                    {
                        appointment.AppointmentId,
                        slot.DoctorId,
                        appointment.PatientId,
                        appointment.Title,
                        appointment.Description,
                        date = appointment.DateOf.ToString("dd/MM/yyyy"),
                        appointment.Status,

                        slot.SlotDay,
                        startTime = slot.StartTime.ToString("HH:mm"),
                        endTime = slot.EndTime.ToString("HH:mm"),

                        userWhoCancelled.FirstName,
                        userWhoCancelled.LastName,

                    }, jsonSerializerOptions)
                };

                // save notification
                await dbContext.Notifications.AddAsync(notification);
                await dbContext.SaveChangesAsync();

                // send ws notification
                await notifyHubContext.Clients.Group($"notify-{userToSendNotificationToId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
                {
                    notification.NotificationId,
                    notification.TypeId,
                    notification.UserId,
                    notification.Content,
                    notification.Seen,
                    notification.DateSent
                });

            }

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Response { errorMessage = "Unable to cancel appointment! Try again later", data = "" });
        }
    }

    // UPDATE APPOINTMENT STATUS
    /// <summary>Updates the status of an appointment.</summary>
    /// <param name="appointmentId">The ID of the appointment.</param>
    /// <param name="code">The confirmation code of the appointment.</param>
    /// <param name="status">The status of the appointment.</param>
    /// <returns>A response object containing the ID of the appointment.</returns>
    private async Task<Response> UpdateAppointmentStatus(int appointmentId, string code, Status status)
    {
        try
        {
            // get appointment
            Appointment? appointment = await dbContext.Appointments.Where(ap => ap.AppointmentId == appointmentId).FirstOrDefaultAsync();
            if (appointment is null)
            {
                return new Response { errorMessage = "Appointment not found", data = "" };
            }

            // check code if needed
            if (code.Length > 0)
            {
                if (appointment.ConfirmationCode != code)
                {
                    return new Response { errorMessage = "Incorrect code!", data = "" };
                }
            }

            // get patient
            var patient = await dbContext.UserAccounts.Where(u => u.UserId == appointment.PatientId).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstOrDefaultAsync();
            if (patient is null)
            {
                return new Response { errorMessage = "Patient not found", data = "" };
            }


            if (status == Status.REJECTED && appointment.Status == (int)Status.APPROVED)
            {
                return new Response { errorMessage = "Unable to reject an approved appointment! Please login and cancel the appointment instead.", data = "" };
            }

            // get slot
            var slot = await dbContext.AppointmentSlots.Where(slot => slot.SlotId == appointment.SlotId).FirstAsync();

            // update status
            appointment.Status = (int)status;

            // update db
            dbContext.Appointments.Update(appointment);
            await dbContext.SaveChangesAsync();

            // get doctor
            var doctor = await dbContext.UserAccounts.Where(u => u.UserId == slot.DoctorId).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstOrDefaultAsync();
            if (doctor is null)
            {
                return new Response { errorMessage = "Doctor not found", data = "" };
            }

            // create notification
            Notification notification = new Notification()
            {
                TypeId = 2,
                UserId = appointment.PatientId,
                Content = JsonSerializer.Serialize(new
                {
                    appointment.AppointmentId,
                    slot.DoctorId,
                    appointment.PatientId,
                    appointment.Title,
                    appointment.Description,
                    date = appointment.DateOf.ToString("dd/MM/yyyy"),
                    appointment.Status,

                    slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm"),

                    doctor.FirstName,
                    doctor.LastName,

                    patientFirstname = patient.FirstName,
                    patientLastname = patient.LastName,
                }, jsonSerializerOptions)
            };
            await dbContext.Notifications.AddAsync(notification);
            await dbContext.SaveChangesAsync();

            // send ws notification
            await notifyHubContext.Clients.Group($"notify-{appointment.PatientId}").SendAsync(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, new
            {
                notification.NotificationId,
                notification.TypeId,
                notification.UserId,
                notification.Content,
                notification.Seen,
                notification.DateSent
            });

            // set html color
            string color = "#4444FF";
            string appointmentStatus = "Approved";

            if (status == Status.REJECTED)
            {
                color = "#FF4444";
                appointmentStatus = "Rejected";
            }

            // send email to patient
            SendAppointmentStatusEmail(patient.Email, patient.FirstName + " " + patient.LastName, color, appointmentStatus, appointment, slot);

            return new Response { errorMessage = "", data = appointment.AppointmentId };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return new Response { errorMessage = "Server error, please try again later", data = "" };
        }
    }

    // SEND APPOINTMENT APPROVAL EMAIL
    /// <summary>Sends an email to the doctor confirming the appointment.</summary>
    /// <param name="doctor">The doctor.</param>
    /// <param name="patient">The patient.</param>
    /// <param name="appointment">The appointment.</param>
    /// <param name="slot">The slot.</param>
    private void SendAppointmentApprovalEmail(UserAccount doctor, UserAccount patient, Appointment appointment, AppointmentSlot slot)
    {
        try
        {
            // build template
            string baseUrl = HtmlBuilder.BaseUrl;
            var replacements = new List<Tuple<string, string>>(){
                new("{fname}",patient.FirstName+" "+patient.LastName),
                new("{email}",patient.Email),
                new("{title}",appointment.Title),
                new("{date}",appointment.DateOf.ToShortDateString()),
                new("{stime}",slot.StartTime.ToShortTimeString()),
                new("{etime}",slot.EndTime.ToShortTimeString()),

                new("{alink}",baseUrl+"/api/appointments/approve/"+appointment.AppointmentId.ToString()+"/"+appointment.ConfirmationCode),
                new("{rlink}",baseUrl+"/api/appointments/reject/"+appointment.AppointmentId.ToString()+"/"+appointment.ConfirmationCode)
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/approveAppointmentEmail.html", replacements);

            // create email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Ipulse Mailer", configuration["MailSettings:Username"]));
            message.To.Add(new MailboxAddress(doctor.FirstName + " " + doctor.LastName, doctor.Email));
            message.Subject = "An Appointment has be requested!";
            message.Body = new TextPart("html")
            {
                Text = htmlString
            };

            // send email
            this.mailHandler.sendMessage(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
        }

    }

    // SEND APPOINTMENT STATUS EMAIL
    /// <summary>Sends an email to the patient with the appointment status.</summary>
    /// <param name="patientEmail">The patient's email address.</param>
    /// <param name="patientName">The patient's name.</param>
    /// <param name="color">The color of the appointment.</param>
    /// <param name="status">The status of the appointment.</param>
    /// <param name="appointment">The appointment.</param>
    /// <param name="slot">The appointment slot.</param>
    private void SendAppointmentStatusEmail(string patientEmail, string patientName, string color, string status, Appointment appointment, AppointmentSlot slot)
    {
        try
        {
            // build template
            string baseUrl = HtmlBuilder.BaseUrl;
            var replacements = new List<Tuple<string, string>>(){
                new("{color}",color),
                new("{status}",status),

                new("{title}",appointment.Title),
                new("{date}",appointment.DateOf.ToShortDateString()),
                new("{stime}",slot.StartTime.ToShortTimeString()),
                new("{etime}",slot.EndTime.ToShortTimeString())
            };
            var htmlString = HtmlBuilder.build("/Html_Templates/appointmentApprovedRejectedEmail.html", replacements);

            Console.WriteLine(patientEmail);

            // create email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Ipulse Mailer", configuration["MailSettings:Username"]));
            message.To.Add(new MailboxAddress(patientName, patientEmail));
            message.Subject = "Appointment update!";
            message.Body = new TextPart("html")
            {
                Text = htmlString
            };

            // send email
            this.mailHandler.sendMessage(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
        }

    }

}