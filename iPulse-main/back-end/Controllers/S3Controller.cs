using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace iPulse_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class S3Controller : ControllerBase
{

    private IConfiguration configuration;
    private IPulseContext dbContext;
    private IS3Service s3Service;

    public S3Controller(IConfiguration configuration, IPulseContext context, IS3Service s3Service)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.s3Service = s3Service;
    }

    // GET PRESIGNED GET URL
    /// <summary>Retrieves a presigned URL for a file.</summary>
    /// <param name="details">The details of the file to retrieve the presigned URL for.</param>
    /// <returns>The presigned URL for the file.</returns>
    [HttpPost("signed/get")]
    [AllowAnonymous]
    public IActionResult GetPresignedGetUrl(GetPresignedGetUrlRequest details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            string signedUrl = s3Service.getPresignedGetUrl(details.filePath);

            return Ok(new Response
            {
                errorMessage = "",
                data = new
                {
                    signedUrl = signedUrl
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    // GET PRESIGNED PUT URL
    /// <summary>Retrieves a presigned URL for uploading a file to S3.</summary>
    /// <param name="details">The details of the file to upload.</param>
    /// <returns>The presigned URL.</returns>
    [HttpPost("signed/put")]
    public IActionResult GetPresignedPutUrl(GetPresignedPutUrlRequest details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return BadRequest();
        }

        try
        {
            string filePath = $"{Guid.NewGuid()}-{details.filename}";
            string signedUrl = s3Service.getPresignedPutUrl(filePath);

            return Ok(new Response
            {
                errorMessage = "",
                data = new
                {
                    filePath = filePath,
                    signedUrl = signedUrl
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }

    }
}