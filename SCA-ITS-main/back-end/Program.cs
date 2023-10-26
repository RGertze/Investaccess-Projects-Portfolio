using System.Text;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SCA_ITS_back_end.Authorization.Enums;
using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.Utilities;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory,

    // set static content folder to dist
    WebRootPath = "dist"
});
ConfigurationManager configuration = builder.Configuration;


// Add services to the container.

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
builder.Services.AddDbContext<SCA_ITSContext>(options =>
{
    var connString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connString, ServerVersion.AutoDetect(connString));
});

// add moodle sync queue data structure
builder.Services.AddSingleton<MoodleSyncQueue>();

// Add queue hosted service
builder.Services.AddHostedService<MoodleSyncQueueService>();

// Add http client
builder.Services.AddHttpClient();

// Add moodle service
builder.Services.AddScoped<MoodleService>();

// Add moodle sync service
builder.Services.AddScoped<MoodleSyncService>();

// Add registration service
builder.Services.AddScoped<RegistrationService>();

// Add user service
builder.Services.AddScoped<UserService>();

// Add parent service
builder.Services.AddScoped<ParentsService>();

// Add staff service
builder.Services.AddScoped<StaffService>();

// Add course categories service
builder.Services.AddScoped<CourseCategoriesService>();

// Add courses service
builder.Services.AddScoped<CoursesService>();

// Add student service
builder.Services.AddScoped<StudentService>();

// Add pre primary progress report service
builder.Services.AddScoped<PrePrimaryProgressReportsService>();

// Add Student progress report service
builder.Services.AddScoped<StudentProgressReportService>();

// Add Student progress report service
builder.Services.AddScoped<StudentReportService>();

// Add report group service
builder.Services.AddScoped<IReportGroupService, ReportGroupService>();

// Add report generation service
builder.Services.AddScoped<ReportGenerationService>();

// Add financial statement service
builder.Services.AddScoped<FinancialStatementService>();

// Add fees for grades service
builder.Services.AddScoped<FeesForGradesService>();

// Add files to delete service
builder.Services.AddScoped<FilesToDeleteService>();

// Add medical conditions service
builder.Services.AddScoped<MedicalConditionsService>();

// Add student medical conditions service
builder.Services.AddScoped<StudentMedicalConditionsService>();

// Add non sca siblings service
builder.Services.AddScoped<NonScaSiblingService>();

// Add other parent service
builder.Services.AddScoped<OtherParentsService>();

// Add student other parent service
builder.Services.AddScoped<StudentOtherParentsService>();

// Add AWS S3 Client service
builder.Services.AddSingleton<IS3Service, S3Service>();

// Add razor stuff
builder.Services.AddRazorPages();
builder.Services.AddMvcCore().AddRazorViewEngine();
builder.Services.AddScoped<IViewRenderService, ViewRenderService>();

//----   ADD BACKGROUND SERVICES   ----

// Add report generation service
builder.Services.AddHostedService<ReportGenerationBackroundService>();

//-------------------------------------

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

    options.AddPolicy(      // require admin or parent
            Policies.REQUIRE_ADMIN_OR_PARENT_ROLE,
            policy => policy.RequireClaim("roleId", new string[] { ((int)Role.PARENT).ToString(), ((int)Role.ADMIN).ToString() })
        );

    options.AddPolicy(      // require parent
        Policies.REQUIRE_PARENT_ROLE,
        policy => policy.RequireClaim("roleId", ((int)Role.PARENT).ToString())
    );

    options.AddPolicy(      // require staff
        Policies.REQUIRE_STAFF_ROLE,
        policy => policy.RequireClaim("roleId", ((int)Role.STAFF).ToString())
    );

    options.AddPolicy(      // require parent or staff
        Policies.REQUIRE_STAFF_OR_PARENT_ROLE,
        policy => policy.RequireClaim("roleId", new string[] { ((int)Role.PARENT).ToString(), ((int)Role.STAFF).ToString() })
    );

    options.AddPolicy(      // require admin or staff
            Policies.REQUIRE_ADMIN_OR_STAFF_ROLE,
            policy => policy.RequireClaim("roleId", new string[] { ((int)Role.ADMIN).ToString(), ((int)Role.STAFF).ToString() })
        );

    options.AddPolicy(      // require any
        Policies.REQUIRE_ANY_ROLE,
        policy => policy.RequireClaim("roleId", new string[] { ((int)Role.ADMIN).ToString(), ((int)Role.STAFF).ToString(), ((int)Role.PARENT).ToString() })
    );
});

// Add Mail handler
builder.Services.AddScoped<IMailHandler, MailHandler>();

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

app.MapControllers();
app.MapFallbackToFile("index.html");


app.Run();


public partial class Program { }