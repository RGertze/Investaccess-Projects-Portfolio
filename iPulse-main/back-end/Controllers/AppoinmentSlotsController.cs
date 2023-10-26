using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Helpers.Enums;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/appointment-slots")]
public class AppoinmentSlotsController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IMailHandler mailHandler;

    public AppoinmentSlotsController(IConfiguration configuration, IPulseContext context, IMailHandler mailHandler)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.mailHandler = mailHandler;
    }

    /// <summary>Retrieves all the doctor's appointments.</summary>
    /// <param name="id">The doctor's id.</param>
    /// <returns>A list of all the doctor's appointments.</returns>
    // GET ALL SLOTS FOR DOCTOR
    [HttpGet("doctor/{id}")]
    public async Task<IActionResult> GetAllDoctorAppointments(int id)
    {
        try
        {
            if (!(await dbContext.DoctorProfiles.AnyAsync(d => d.UserId == id)))
            {
                return NotFound(new Response { errorMessage = "Doctor not found", data = "" });
            }

            var slots = await (
                from slot in dbContext.AppointmentSlots
                where slot.DoctorId == id
                orderby slot.StartTime ascending
                select new
                {
                    id = slot.SlotId,
                    day = slot.SlotDay,
                    startTime = slot.StartTime.ToString("HH:mm"),
                    endTime = slot.EndTime.ToString("HH:mm")
                }
            ).ToListAsync();
            return Ok(new Response { errorMessage = "", data = slots });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }


    // ADD APPOINTMENT SLOT
    /// <summary>Adds a slot to the database.</summary>
    /// <param name="details">The details of the slot to be added.</param>
    /// <returns>A response object indicating success or failure.</returns>
    /// <exception cref="ArgumentNullException">Thrown when details is null.</exception>
    /// <exception cref="ArgumentException">Thrown when details is empty.</exception>
    /// <exception cref="InvalidOperationException">Thrown when the application isn't in foreground.</exception>
    /// <exception cref="NotFoundException">Thrown when the doctor does not exist.</exception>
    /// <exception cref
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpPost]
    public async Task<IActionResult> AddSlot(AddAppointmentSlot details)
    {
        if (AddAppointmentRequest.IsNullOrEmpty(details))
        {
            return BadRequest(details);
        }

        // check if day is within range
        if (details.day < 1 || details.day > 7)
        {
            return BadRequest(new Response { errorMessage = "Date Out of range. Must be between 1 and 7", data = "" });
        }

        try
        {

            // check for valid dates
            var start = TimeOnly.Parse(details.startTime);
            var end = TimeOnly.Parse(details.endTime);

            // check if end time > start time, make exception for times ending on 00:00
            if (start.CompareTo(end) >= 0 && end != TimeOnly.Parse("00:00"))
            {
                return BadRequest(new Response { errorMessage = "End time should be greater than start time!", data = "" });
            }

            // check if duration >= 15 min
            if (end.AddMinutes(-15).CompareTo(start) < 0)
            {
                return BadRequest(new Response { errorMessage = "Slot should last atleast 15min!", data = "" });
            }

            // check for time conflicts
            if (await dbContext.AppointmentSlots.Where(slot => slot.DoctorId == details.doctorId && slot.SlotDay == details.day)
            .AnyAsync(slot => (start >= slot.StartTime && start < slot.EndTime) || (end > slot.StartTime && end <= slot.EndTime)))
            {
                return Conflict(new Response { errorMessage = "A slot within that time frame already exists!", data = "" });
            }
        }
        catch (FormatException ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return BadRequest(new Response { errorMessage = "Invalid dates provided", data = "" });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }

        try
        {
            // check if doctor exists
            var doctor = await dbContext.UserAccounts.Where(u => u.UserId == details.doctorId && u.UserTypeId == 2).FirstOrDefaultAsync();
            if (doctor is null)
            {
                return NotFound(new Response { errorMessage = "Doctor does not exist", data = "" });
            }


            // check if max slots reached  (32 per day)
            if (await dbContext.AppointmentSlots.Where(s => s.SlotDay == details.day && s.DoctorId == details.doctorId).CountAsync() >= 32)
            {
                return Conflict(new Response { errorMessage = "Maximum number of slots for the day reached!", data = "" });
            }

            // create slot
            var slot = new AppointmentSlot
            {
                DoctorId = details.doctorId,
                SlotDay = details.day,
                StartTime = TimeOnly.Parse(details.startTime),
                EndTime = TimeOnly.Parse(details.endTime),
            };

            // add slot
            await dbContext.AppointmentSlots.AddAsync(slot);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(AddSlot), new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }

    }

    // ADD MULTIPLE APPOINTMENT SLOTS
    /// <summary>Adds multiple slots to the database.</summary>
    /// <param name="details">The details of the slots to add.</param>
    /// <returns>A response object containing the result of the operation.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpPost("multiple")]
    public async Task<IActionResult> AddSlotMultipleSlots(List<AddAppointmentSlot> details)
    {
        try
        {

            var slotsToAdd = new List<AppointmentSlot>();
            var responses = new List<Response>();

            details.ForEach(potentialSlot =>
            {
                // check for empty values
                if (BaseRequest.IsNullOrEmpty(potentialSlot))
                {
                    responses.Add(new Response { errorMessage = "Empty values", data = "" });
                    return;
                }

                // check if day is within range
                if (potentialSlot.day < 1 || potentialSlot.day > 7)
                {
                    responses.Add(new Response { errorMessage = "Date Out of range. Must be between 1 and 7", data = "" });
                    return;
                }

                var start = TimeOnly.Parse(potentialSlot.startTime);
                var end = TimeOnly.Parse(potentialSlot.endTime);

                // check if end time > start time, make exception for times ending on 00:00
                if (start.CompareTo(end) >= 0 && end != TimeOnly.Parse("00:00"))
                {
                    responses.Add(new Response { errorMessage = "End time should be greater than start time!", data = "" });
                    return;
                }

                // check if duration >= 15 min
                if (end.AddMinutes(-15).CompareTo(start) < 0)
                {
                    responses.Add(new Response { errorMessage = "Slot should last atleast 15min!", data = "" });
                    return;
                }

                // check for conflicts in array sent
                if (
                    details.Any(slot => !slot.Equals(potentialSlot)
                                        && slot.day == potentialSlot.day
                                        && (
                                            (start >= TimeOnly.Parse(slot.startTime) && start < TimeOnly.Parse(slot.endTime))
                                            || (end > TimeOnly.Parse(slot.startTime) && end <= TimeOnly.Parse(slot.endTime))
                                        ))
                   )
                {
                    responses.Add(new Response { errorMessage = $"A conflict has occured with another slot being added for the same day", data = "" });
                    return;
                }

                // check for conflicts in existing slots
                if (dbContext.AppointmentSlots.Where(slot => slot.DoctorId == potentialSlot.doctorId && slot.SlotDay == potentialSlot.day)
                    .Any(slot => (start >= slot.StartTime && start < slot.EndTime) || (end > slot.StartTime && end <= slot.EndTime)))
                {
                    responses.Add(new Response { errorMessage = "A conflict has occured with an existing slot", data = "" });
                    return;
                }

                // check if doctor exists
                var doctor = dbContext.UserAccounts.Where(u => u.UserId == potentialSlot.doctorId && u.UserTypeId == 2).FirstOrDefault();
                if (doctor is null)
                {
                    responses.Add(new Response { errorMessage = "Doctor does not exist", data = "" });
                    return;
                }

                // check if max slots reached  (32 per day)
                if (dbContext.AppointmentSlots.Where(s => s.SlotDay == potentialSlot.day && s.DoctorId == potentialSlot.doctorId).Count() >= 32)
                {
                    responses.Add(new Response { errorMessage = "Maximum number of slots for the day reached!", data = "" });
                    return;
                }

                // add to list of slots to add
                slotsToAdd.Add(new AppointmentSlot()
                {
                    DoctorId = potentialSlot.doctorId,
                    SlotDay = potentialSlot.day,
                    StartTime = start,
                    EndTime = end,
                });

                // add success response
                responses.Add(new Response { errorMessage = "", data = new { message = "success" } });
            });

            // add slots to db
            await dbContext.AppointmentSlots.AddRangeAsync(slotsToAdd);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(AddSlot), new Response { errorMessage = "", data = responses });

        }
        catch (FormatException ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return BadRequest(new Response { errorMessage = "Invalid dates provided", data = "" });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }


    // DELETE APPOINTMENT SLOT
    /// <summary>Deletes an appointment slot.</summary>
    /// <param name="id">The id of the slot to delete.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSlot(int id)
    {
        try
        {
            var slot = await dbContext.AppointmentSlots.Where(slot => slot.SlotId == id).FirstOrDefaultAsync();
            if (slot is null)
            {
                return NotFound(new Response { errorMessage = "Slot does not exist", data = "" });
            }

            dbContext.AppointmentSlots.Remove(slot);
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
}