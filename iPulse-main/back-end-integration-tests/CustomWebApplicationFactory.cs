using back_end_tests.Helpers;
using iPulse_back_end.DB_Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;


namespace back_end_tests;

public class CustomWebApplicationFactory<TStartup>
    : WebApplicationFactory<TStartup> where TStartup : class
{
    private readonly IPulseContext? _context;
    private string connString;

    public CustomWebApplicationFactory()
    {
        // create unique database
        connString = $"server=localhost; port=3306; database=IPulse_Test_{Guid.NewGuid().ToString()}; user=dev; password=Dev@1234; Persist Security Info=False; Connect Timeout=300000";

        var optionsBuilder = new DbContextOptionsBuilder<IPulseContext>();
        optionsBuilder.UseMySql(connString, ServerVersion.AutoDetect(connString));

        _context = new IPulseContext(optionsBuilder.Options);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                    typeof(DbContextOptions<IPulseContext>));

            services.Remove(descriptor);

            services.AddDbContext<IPulseContext>(options =>
            {
                options.UseMySql(connString, ServerVersion.AutoDetect(connString));
            });

            var sp = services.BuildServiceProvider();

            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<IPulseContext>();
                var logger = scopedServices
                    .GetRequiredService<ILogger<CustomWebApplicationFactory<TStartup>>>();

                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();

                try
                {
                    DB_Init.InitDbForTests(db);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred setting up the database. Error: {Message}", ex.Message);
                }
            }

        });
    }

    protected override void Dispose(bool disposing)
    {
        if (_context != null)
        {
            _context.Database.EnsureDeleted();
        }

        base.Dispose(disposing);
    }
}