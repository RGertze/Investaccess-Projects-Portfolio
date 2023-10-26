using back_end.DB_Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back_end.Models;

namespace back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly TestDbContext _dbContext;

    private readonly ILogger<ItemsController> _logger;

    public ItemsController(ILogger<ItemsController> logger, TestDbContext context)
    {
        _logger = logger;
        _dbContext = context;
    }

    [HttpGet]
    public async Task<Response> GetAll([FromQuery] ItemsFilter filter)
    {
        try
        {
            var records = await (
                from item in _dbContext.Items
                join category in _dbContext.Categories on item.CategoryId equals category.CategoryId
                where item.CategoryId == (filter.categoryId ?? item.CategoryId)
                select new
                {
                    item.ItemId,
                    item.ItemName,
                    item.ItemDescription,
                    item.CategoryId,
                    CategoryName = category.CategoryName
                }
            ).ToListAsync();

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
            var record = await _dbContext.Items.Where(item => item.ItemId == id).FirstOrDefaultAsync();
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
    public async Task<Response> Add(Item item)
    {
        try
        {
            await _dbContext.Items.AddAsync(item);
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
            var record = await _dbContext.Items.Where(item => item.ItemId == id).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "record not found", data = 404 };

            _dbContext.Items.Remove(record);
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