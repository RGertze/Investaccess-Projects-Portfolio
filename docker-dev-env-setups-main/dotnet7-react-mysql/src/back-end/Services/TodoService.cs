using back_end.Data;
using back_end.Models;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public enum TODO_STATUS
{
    INCOMPLETE = 0,
    COMPLETE = 1
}

public interface ITodoService : IBaseService<Todo>
{
    public Task<Result> MarkAsComplete(int id);
    public Task<Result> MarkAsIncomplete(int id);
    public Task<Result> GetAllForUser(int userId);
}

public class TodoService : ITodoService
{
    // implement the service
    private readonly ApplicationDBContext _context;

    public TodoService(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<Result> Add(Todo entity)
    {
        try
        {
            if (string.IsNullOrEmpty(entity.Name))
            {
                return new Result
                {
                    statusCode = 400,
                    message = "Name is required",
                    data = ""
                };
            }

            entity.UpdatedAt = DateTime.Now;
            entity.CreatedAt = DateTime.Now;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == entity.UserId);
            if (user is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "User not found",
                    data = ""
                };
            }

            var created = await _context.Todos.AddAsync(entity);
            await _context.SaveChangesAsync();

            return new Result
            {
                statusCode = 200,
                message = "Todo created successfully",
                data = created.Entity.Id
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }

    public async Task<Result> Delete(Todo entity)
    {
        try
        {
            var existing = await _context.Todos.FirstOrDefaultAsync(t => t.Id == entity.Id);
            if (existing is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "Todo not found",
                    data = ""
                };
            }

            _context.Todos.Remove(existing);
            await _context.SaveChangesAsync();

            return new Result
            {
                statusCode = 200,
                message = "Todo deleted successfully",
                data = ""
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }

    public async Task<Result> GetAll()
    {
        try
        {
            var todos = await _context.Todos.ToListAsync();
            return new Result
            {
                statusCode = 200,
                message = "Todos retrieved successfully",
                data = todos
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }

    public async Task<Result> GetById(int id)
    {
        try
        {
            var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);
            if (todo is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "Todo not found",
                    data = ""
                };
            }

            return new Result
            {
                statusCode = 200,
                message = "Todo retrieved successfully",
                data = todo
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }


    public async Task<Result> Update(Todo entity)
    {
        try
        {
            if (string.IsNullOrEmpty(entity.Name))
            {
                return new Result
                {
                    statusCode = 400,
                    message = "Name is required",
                    data = ""
                };
            }

            var existing = await _context.Todos.FirstOrDefaultAsync(t => t.Id == entity.Id);
            if (existing is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "Todo not found",
                    data = ""
                };
            }

            existing.Name = entity.Name;
            existing.Description = entity.Description;
            existing.IsComplete = entity.IsComplete;

            await _context.SaveChangesAsync();

            return new Result
            {
                statusCode = 200,
                message = "Todo updated successfully",
                data = ""
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }

    public async Task<Result> MarkAsComplete(int id)
    {
        try
        {
            var existing = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);
            if (existing is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "Todo not found",
                    data = ""
                };
            }

            existing.IsComplete = (int)TODO_STATUS.COMPLETE;
            await _context.SaveChangesAsync();

            return new Result
            {
                statusCode = 200,
                message = "Todo marked as complete",
                data = ""
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }

    public async Task<Result> MarkAsIncomplete(int id)
    {
        try
        {
            var existing = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);
            if (existing is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "Todo not found",
                    data = ""
                };
            }

            existing.IsComplete = (int)TODO_STATUS.INCOMPLETE;
            await _context.SaveChangesAsync();

            return new Result
            {
                statusCode = 200,
                message = "Todo marked as incomplete",
                data = ""
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }

    public async Task<Result> GetAllForUser(int userId)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "User not found",
                    data = ""
                };
            }

            var todos = await _context.Todos.Where(t => t.UserId == userId).Select(t => new
            {
                t.Id,
                t.Name,
                t.Description,
                t.IsComplete,
                t.UserId,
                t.CreatedAt,
                t.UpdatedAt
            }).ToListAsync();
            return new Result
            {
                statusCode = 200,
                message = "Todos retrieved successfully",
                data = todos
            };
        }
        catch (Exception ex)
        {
            return new Result
            {
                statusCode = 500,
                message = ex.Message,
                data = ""
            };
        }
    }
}