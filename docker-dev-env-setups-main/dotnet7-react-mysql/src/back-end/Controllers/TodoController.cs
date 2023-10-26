using Microsoft.AspNetCore.Mvc;
using back_end.Services;
using back_end.Models;
using Microsoft.AspNetCore.Authorization;
using back_end.Utilities;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [Authorize(Policy = Policies.REQUIRE_ADMIN_ROLE)]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _todoService.GetAll();
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _todoService.GetById(id);
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Add(TodoRequest todo)
    {
        try
        {
            var result = await _todoService.Add(new Todo
            {
                UserId = todo.userId,
                Name = todo.name,
                Description = todo.description,
            });
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TodoRequest todo)
    {
        try
        {
            var result = await _todoService.Update(new Todo
            {
                Id = id,
                UserId = todo.userId,
                Name = todo.name,
                Description = todo.description,
            });
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var todo = new Todo { Id = id };
            var result = await _todoService.Delete(todo);
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> MarkAsComplete(int id)
    {
        try
        {
            var result = await _todoService.MarkAsComplete(id);
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }

    [HttpPost("{id}/incomplete")]
    public async Task<IActionResult> MarkAsIncomplete(int id)
    {
        try
        {
            var result = await _todoService.MarkAsIncomplete(id);
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetAllForUser(int userId)
    {
        try
        {
            var result = await _todoService.GetAllForUser(userId);
            return StatusCode(result.statusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            });
        }
    }
}