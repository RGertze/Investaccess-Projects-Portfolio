using back_end_integration_tests.Helpers;
using back_end.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Data.Sqlite;


namespace back_end_tests;

public class CustomWebApplicationFactory<TStartup>
    : WebApplicationFactory<TStartup> where TStartup : class
{
    private readonly ApplicationDBContext? _context;
    private string connString;
    private SqliteConnection connection;

    public CustomWebApplicationFactory()
    {
        // create unique database
        connString = $"Data Source={Guid.NewGuid().ToString()}:memory:";

        connection = new SqliteConnection(this.connString);
        connection.Open();

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDBContext>();
        optionsBuilder.UseSqlite(connection);

        _context = new ApplicationDBContext(optionsBuilder.Options);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                    typeof(DbContextOptions<ApplicationDBContext>));

            services.Remove(descriptor);


            services.AddDbContext<ApplicationDBContext>(options =>
            {
                options.UseSqlite(connString);
            });

            var sp = services.BuildServiceProvider();

            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<ApplicationDBContext>();
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