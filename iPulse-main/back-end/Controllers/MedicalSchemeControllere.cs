using iPulse_back_end.DB_Models;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace iPulse_back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicalSchemeController : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;

    public MedicalSchemeController(IConfiguration configuration, IPulseContext context)
    {
        this.configuration = configuration;
        this.dbContext = context;
    }

    // GET ALL MEDICAL SCHEMES
    /// <summary>Retrieves the list of medical aid schemes.</summary>
    /// <returns>The list of medical aid schemes.</returns>
    [HttpGet()]
    public async Task<IActionResult> Get()
    {
        try
        {
            var medicalAidSchemes = await dbContext.MedicalAidSchemes.Select(mas => new { mas.MedicalAidSchemeId, mas.MedicalAidSchemeName }).ToListAsync();
            return Ok(new Response { errorMessage = "", data = medicalAidSchemes });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }
}