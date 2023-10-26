using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/files-to-delete")]
public class FilesToDeleteController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private FilesToDeleteService filesToDeleteService;

    public FilesToDeleteController(IConfiguration configuration, SCA_ITSContext context, FilesToDeleteService filesToDeleteService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.filesToDeleteService = filesToDeleteService;
    }

    #region GET

    //---   GET ALL  ---
    [AllowAnonymous]
    [HttpPost("get")]
    public async Task<IActionResult> GetAll(LambdaBaseRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return BadRequest(new Response { errorMessage = "Empty values", data = "" });
            }

            if (details.token != configuration["AWS_LAMBDA:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await filesToDeleteService.GetAll();
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    //---   GET ALL FILES  ---
    [AllowAnonymous]
    [HttpPost("all-files")]
    public async Task<IActionResult> GetAllFiles(LambdaBaseRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return BadRequest(new Response { errorMessage = "Empty values", data = "" });
            }

            if (details.token != configuration["AWS_LAMBDA:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await filesToDeleteService.GetAllFiles();
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

    #region DELETE

    //---   DELETE MANY   ---
    [AllowAnonymous]
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteMany(DeleteFileToDeleteRequest details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return BadRequest(new Response { errorMessage = "Empty values", data = "" });
            }

            if (details.token != configuration["AWS_LAMBDA:Token"])
                return StatusCode(403, new Response { errorMessage = "Invalid token", data = "" });

            var result = await filesToDeleteService.DeleteMany(details.filesToDelete);
            if (result.errorMessage != "")
            {
                return StatusCode(result.data, result);
            }

            return Ok(new Response { errorMessage = "", data = new { message = "success" } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new Response { errorMessage = ex.Message, data = "" });
        }
    }

    #endregion

}