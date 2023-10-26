namespace back_end.Services;

using back_end.Data;
using back_end.Models;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class RoleService : IBaseService<Role>
{
    private readonly ApplicationDBContext _context;

    public RoleService(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<Result> Add(Role entity)
    {
        try
        {
            var existing = await _context.Roles.FirstOrDefaultAsync(r => r.Name == entity.Name);
            if (existing is not null)
            {
                return new Result
                {
                    statusCode = 409,
                    message = "Role already exists",
                    data = ""
                };
            }

            var created = await _context.Roles.AddAsync(entity);
            await _context.SaveChangesAsync();

            return new Result
            {
                statusCode = 200,
                message = "Role already exists",
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

    public async Task<Result> Delete(Role entity)
    {
        try
        {
            var existing = await _context.Roles.FirstOrDefaultAsync(r => r.Id == entity.Id);
            if (existing is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "Role not found",
                    data = ""
                };
            }

            _context.Roles.Remove(entity);
            await _context.SaveChangesAsync();
            return new Result
            {
                statusCode = 200,
                message = "Role deleted successfully",
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
            var roles = await _context.Roles.ToListAsync();
            return new Result
            {
                statusCode = 200,
                message = "Roles retrieved successfully",
                data = roles
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
            var existing = await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (existing is null)
            {
                return new Result
                {
                    statusCode = 404,
                    message = "Role not found",
                    data = ""
                };
            }

            return new Result
            {
                statusCode = 200,
                message = "Role retrieved successfully",
                data = existing
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

    public async Task<Result> Update(Role entity)
    {
        try
        {
            _context.Roles.Update(entity);
            await _context.SaveChangesAsync();
            return new Result
            {
                statusCode = 200,
                message = "Role updated successfully",
                data = entity.Id
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