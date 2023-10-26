using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class S3Controller : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private IS3Service s3Service;

    public S3Controller(IConfiguration configuration, SCA_ITSContext context, IS3Service s3Service)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.s3Service = s3Service;
    }

    // GET PRESIGNED GET URL
    [HttpPost("signed/get")]
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