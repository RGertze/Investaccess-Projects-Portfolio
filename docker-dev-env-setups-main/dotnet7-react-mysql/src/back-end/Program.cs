using Microsoft.EntityFrameworkCore;
using back_end.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using back_end.Utilities;
using back_end.Services;
using back_end.Models;

var builder = WebApplication.CreateBuilder(args);

ConfigurationManager configuration = builder.Configuration;

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAll", policy =>
    {
        policy.AllowAnyOrigin();
        policy.AllowAnyMethod();
        policy.AllowAnyHeader();
    });
});

// add db context
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    var connString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connString, ServerVersion.AutoDetect(connString));
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("IS-TOKEN-EXPIRED", "true");
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(      // require admin
        Policies.REQUIRE_ADMIN_ROLE,
        policy => policy.RequireClaim("roleId", ((int)ROLES.ADMIN).ToString())
    );

    options.AddPolicy(      // require user
            Policies.REQUIRE_USER_ROLE,
            policy => policy.RequireClaim("roleId", new string[] { ((int)ROLES.USER).ToString() })
        );
});


// Add services to the container.
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ITodoService, TodoService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

// use routing
app.UseRouting();

// all requests from anywhere
app.UseCors("AllowAll");

// authentication and autherization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");

// create default roles and admin user
using (var scope = app.Services.CreateScope())
{
    var roleServce = scope.ServiceProvider.GetRequiredService<RoleService>();
    var authService = scope.ServiceProvider.GetRequiredService<AuthService>();

    var roles = new Role[] {
        new Role {Id=(int)ROLES.ADMIN ,Name = "Admin", Description = "Admin"},
        new Role { Id=(int)ROLES.USER,Name = "User", Description="User" }
    };
    foreach (var role in roles)
    {
        await roleServce.Add(role);
    }

    var user = new User
    {
        Id = 1,
        RoleId = (int)ROLES.ADMIN,
        Email = "admin@admin.com",
        Password = "Admin@123",
        RefreshToken = "",
        EmailConfirmationToken = "",
        EmailConfirmed = true,
    };

    await authService.CreateUser(user);
}

app.Run();

public partial class Program { }