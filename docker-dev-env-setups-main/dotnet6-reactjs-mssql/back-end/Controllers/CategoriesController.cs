using back_end.DB_Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back_end.Models;

namespace back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly TestDbContext _dbContext;

    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(ILogger<CategoriesController> logger, TestDbContext context)
    {
        _logger = logger;
        _dbContext = context;
    }

    [HttpGet]
    public async Task<Response> GetAll()
    {
        try
        {
            var records = await _dbContext.Categories.ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    [HttpGet("{id}")]
    public async Task<Response> Get([FromQuery] int id)
    {
        try
        {
            var record = await _dbContext.Categories.Where(c => c.CategoryId == id).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "record not found", data = 404 };

            return new Response { errorMessage = "", data = record };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    [HttpPost]
    public async Task<Response> Add(AddCategoryRequest data)
    {
        try
        {

            Category newCategory = new Category
            {
                CategoryName = data.categoryName,
                CategoryDescription = data.categoryDescription,
                CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            await _dbContext.Categories.AddAsync(newCategory);
            await _dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    [HttpDelete("{id}")]
    public async Task<Response> Delete(int id)
    {
        try
        {
            var record = await _dbContext.Categories.Where(c => c.CategoryId == id).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "record not found", data = 404 };

            _dbContext.Categories.Remove(record);
            await _dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }
}