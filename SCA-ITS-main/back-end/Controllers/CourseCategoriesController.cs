using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;

namespace SCA_ITS_back_end.Controllers;

[Authorize]
[ApiController]
[Route("api/course-categories")]
public class CourseCategoriesController : ControllerBase
{

    private IConfiguration configuration;
    private SCA_ITSContext dbContext;
    private CourseCategoriesService courseCategoriesService;

    public CourseCategoriesController(IConfiguration configuration, SCA_ITSContext context, CourseCategoriesService courseCategoriesService)
    {
        this.configuration = configuration;
        this.dbContext = context;
        this.courseCategoriesService = courseCategoriesService;
    }

    //---   GET ALL   ---
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] SearchCourseCategories searchParams)
    {
        try
        {
            var result = await courseCategoriesService.GetAll(searchParams);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   ADD   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost]
    public async Task<IActionResult> Add(AddCourseCategory details)
    {
        try
        {
            var result = await courseCategoriesService.Add(details, true);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   EDIT   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("edit")]
    public async Task<IActionResult> Edit(UpdateCourseCategory details)
    {
        try
        {
            var result = await courseCategoriesService.Edit(details, true);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }

    //---   DELETE   ---
    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpPost("delete")]
    public async Task<IActionResult> Delete(DeleteCourseCategory details)
    {
        try
        {
            var result = await courseCategoriesService.Delete(details, true);
            if (result.errorMessage != "")
                return StatusCode(result.data, result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = "" });
        }
    }
}