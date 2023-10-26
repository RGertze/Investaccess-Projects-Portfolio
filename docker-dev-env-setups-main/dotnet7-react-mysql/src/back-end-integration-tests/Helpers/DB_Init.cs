using back_end.Models;
using back_end.Data;
using back_end.Utilities;
using Microsoft.EntityFrameworkCore;

namespace back_end_integration_tests.Helpers;

public class DB_Init
{
    public static void InitDbForTests(ApplicationDBContext dbContext)
    {
        // create default user types
        List<Role> roles = new List<Role>(){
            new Role{
                Id=(int)ROLES.ADMIN,
                Name="Admin",
                Description="Admin"
            },
            new Role{
                Id=(int)ROLES.USER,
                Name="User",
                Description="User"
            }
        };
        dbContext.Roles.AddRange(roles);
        dbContext.SaveChanges();

        List<User> users = new List<User>(){
            new User{
                Id=1,
                RoleId=(int)ROLES.ADMIN,
                Email="admin@admin.com",
                EmailConfirmed=true,
                EmailConfirmationToken="abc",
                Password="$2a$11$riK3GI5PnbstVaVXmDE3aOFGFjjiIMirVQkKOO7L3yiner3E7Xkwe",
                RefreshToken="101",
            },
            new User{
                Id=2,
                RoleId=(int)ROLES.USER,
                Email="user@user.com",
                EmailConfirmed=true,
                EmailConfirmationToken="abc",
                Password="$2a$11$riK3GI5PnbstVaVXmDE3aOFGFjjiIMirVQkKOO7L3yiner3E7Xkwe",
                RefreshToken="101",
            },
        };
        dbContext.Users.AddRange(users);
        dbContext.SaveChanges();

        List<Todo> todos = new List<Todo>(){
            new Todo{
                Id=1,
                UserId=2,
                Name="Todo 1",
                Description="Todo 1",
                IsComplete=0,
                CreatedAt=DateTime.Now,
                UpdatedAt=DateTime.Now,
            },
            new Todo{
                Id=2,
                UserId=2,
                Name="Todo 2",
                Description="Todo 2",
                IsComplete=0,
                CreatedAt=DateTime.Now,
                UpdatedAt=DateTime.Now,
            },
            new Todo{
                Id=3,
                UserId=2,
                Name="Todo 3",
                Description="Todo 3",
                IsComplete=1,
                CreatedAt=DateTime.Now,
                UpdatedAt=DateTime.Now,
            },
            new Todo{
                Id=4,
                UserId=2,
                Name="Todo 4",
                Description="Todo 4",
                IsComplete=1,
                CreatedAt=DateTime.Now,
                UpdatedAt=DateTime.Now,
            },
        };
        dbContext.Todos.AddRange(todos);
        dbContext.SaveChanges();
    }
}