using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse_back_end.Models;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SpecialtiesController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;

    public SpecialtiesController(IConfiguration configuration, IPulseContext context)
    {
        this.configuration = configuration;
        this.dbContext = context;
    }

    //----   GET ALL SPECIALTIES   ----
    /// <summary>Retrieves the list of specialties.</summary>       
    /// <returns>The list of specialties.</returns>       
    [HttpGet()]
    public async Task<IActionResult> Get()
    {
        try
        {
            var specialties = await dbContext.DoctorSpecialties.Select(sp => new
            {
                sp.SpecialtyId,
                sp.SpecialtyName
            }).ToListAsync();
            return Ok(new Response { errorMessage = "", data = specialties });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //----   ADD SPECIALTY   ----
    /// <summary>Adds a new specialty to the database.</summary>
    /// <param name="details">The details of the specialty to add.</param>
    /// <returns>A response indicating whether the operation was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost()]
    public async Task<IActionResult> AddSpecialty(AddSpecialty details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(new Response { errorMessage = "Empty values provided", data = "" });
        }

        try
        {
            // check if specialty already exists
            if (await dbContext.DoctorSpecialties.AnyAsync(sp => sp.SpecialtyName.ToLower() == details.name.ToLower()))
            {
                return Conflict(new Response { errorMessage = "Specialty already exists", data = "" });
            }

            // create specialty
            DoctorSpecialty doctorSpecialty = new DoctorSpecialty()
            {
                SpecialtyName = details.name
            };

            // save to db
            await dbContext.DoctorSpecialties.AddAsync(doctorSpecialty);
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

    //----   EDIT SPECIALTY   ----
    /// <summary>Updates a specialty.</summary>
    /// <param name="details">The details of the specialty to update.</param>
    /// <returns>A response indicating whether the update was successful.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> EditSpecialty(EditSpecialty details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest(new Response { errorMessage = "Empty values provided", data = "" });
        }

        try
        {
            // get specialty to edit
            var specialty = await dbContext.DoctorSpecialties.FirstOrDefaultAsync(sp => sp.SpecialtyId == details.id);
            if (specialty is null)
            {
                return NotFound(new Response { errorMessage = "Specialty does not exist", data = "" });
            }

            // check if specialty already exists
            if (await dbContext.DoctorSpecialties.AnyAsync(sp => sp.SpecialtyName.ToLower() == details.name.ToLower()))
            {
                return Conflict(new Response { errorMessage = "A specialty with that name already exists", data = "" });
            }

            // edit specialty
            specialty.SpecialtyName = details.name;

            // save changes
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

    //----   DELETE SPECIALTY   ----
    /// <summary>Deletes a specialty.</summary>
    /// <param name="id">The specialty's id.</param>
    /// <returns>A response object indicating success or failure.</returns>
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSpecialty(int id)
    {
        try
        {
            // get specialty to delete
            var specialty = await dbContext.DoctorSpecialties.FirstOrDefaultAsync(sp => sp.SpecialtyId == id);
            if (specialty is null)
            {
                return NotFound(new Response { errorMessage = "Specialty does not exist", data = "" });
            }

            // check if specialty is in use by doctors
            if (await dbContext.DoctorProfiles.AnyAsync(dp => dp.SpecialtyId == id))
            {
                return Conflict(new Response { errorMessage = "Specialty is currently in use by doctors and cannot be deleted", data = "" });
            }

            // delete
            dbContext.DoctorSpecialties.Remove(specialty);
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