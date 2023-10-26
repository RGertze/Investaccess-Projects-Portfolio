using System.Text;
using iPulse_back_end.Authorization.Enums;
using iPulse_back_end.DB_Models;
using iPulse_back_end.Models;
using iPulse_back_end.Services;
using iPulse_back_end.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SignalRWebpack.Hubs;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory,

    // set static content folder to dist
    WebRootPath = "dist"
});
ConfigurationManager configuration = builder.Configuration;

//----   ADD SERVICES TO THE CONTAINER   ----

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

// Add DBContext
builder.Services.AddDbContext<IPulseContext>(options =>
{
    var connString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connString, ServerVersion.AutoDetect(connString));
});

// Add AWS S3 Client service
builder.Services.AddSingleton<IS3Service, S3Service>();

// Add JWT auth
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
        },

        OnMessageReceived = context =>
          {
              var accessToken = context.Request.Query["access_token"];

              // If the request is for a hub...
              var path = context.HttpContext.Request.Path;
              if (!string.IsNullOrEmpty(accessToken) &&
                  (path.StartsWithSegments("/hubs")))
              {
                  // Read the token out of the query string
                  context.Token = accessToken;
              }
              return Task.CompletedTask;
          }
    };
});

//  Add auth policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(      // require admin
        Policies.REQUIRE_ADMIN_ROLE,
        policy => policy.RequireClaim("roleId", ((int)Role.ADMIN).ToString())
    );

    options.AddPolicy(      // require doctor
        Policies.REQUIRE_DOCTOR_ROLE,
        policy => policy.RequireClaim("roleId", ((int)Role.DOCTOR).ToString())
    );

    options.AddPolicy(      // require patient
        Policies.REQUIRE_PATIENT_ROLE,
        policy => policy.RequireClaim("roleId", ((int)Role.PATIENT).ToString())
    );

    options.AddPolicy(      // require receptionist
        Policies.REQUIRE_RECEPTIONIST_ROLE,
        policy => policy.RequireClaim("roleId", ((int)Role.RECEPTIONIST).ToString())
    );

    options.AddPolicy(      // require doctor or patient
        Policies.REQUIRE_DOCTOR_OR_PATIENT_ROLE,
        policy => policy.RequireClaim("roleId", new string[] { ((int)Role.DOCTOR).ToString(), ((int)Role.PATIENT).ToString() })
    );

    options.AddPolicy(      // require doctor or receptionist
        Policies.REQUIRE_DOCTOR_OR_RECEPTIONIST_ROLE,
        policy => policy.RequireClaim("roleId", new string[] { ((int)Role.DOCTOR).ToString(), ((int)Role.RECEPTIONIST).ToString() })
    );

    options.AddPolicy(      // require doctor or patient or receptionist
        Policies.REQUIRE_DOCTOR_OR_PATIENT_OR_RECEPTIONIST_ROLE,
        policy => policy.RequireClaim("roleId", new string[] { ((int)Role.DOCTOR).ToString(), ((int)Role.PATIENT).ToString(), ((int)Role.RECEPTIONIST).ToString() })
    );

    options.AddPolicy(      // require any
        Policies.REQUIRE_ANY_ROLE,
        policy => policy.RequireClaim("roleId", new string[] { ((int)Role.ADMIN).ToString(), ((int)Role.DOCTOR).ToString(), ((int)Role.PATIENT).ToString() })
    );
});

// Add Mail handler
builder.Services.AddScoped<IMailHandler, MailHandler>();

// Add Services folder services

builder.Services.AddScoped<IBaseService<int, AddPatientNextOfKin, EditPatientNextOfKin>, NextOfKinService>();

// ----------------------------

// Add SignalR
builder.Services.AddSignalR();

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

// all requests from anywhere
app.UseCors("AllowAll");

// serve static files
app.UseStaticFiles();

app.UseRouting();

// authentication and autherization
app.UseAuthentication();
app.UseAuthorization();

// map controllers
app.MapControllers();

// map hubs
app.MapHub<TestHub>("/hubs/test");
app.MapHub<DirectMessageHub>("/hubs/direct-message");
app.MapHub<NotificationsHub>("/hubs/notifications");

// set catch-all to site index
app.MapFallbackToFile("index.html");


app.Run();


public partial class Program { }
