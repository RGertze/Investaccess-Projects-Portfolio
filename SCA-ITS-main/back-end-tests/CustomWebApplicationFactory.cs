using back_end_tests.Helpers;
using SCA_ITS_back_end.DB_Models;
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
    private readonly SCA_ITSContext? _context;
    private string connString;
    private SqliteConnection connection;

    public CustomWebApplicationFactory()
    {
        // create unique database
        // connString = $"server=localhost; port=3306; database=SCA_ITS_Test_{Guid.NewGuid().ToString()}; user=dev; password=Dev@1234; Persist Security Info=False; Connect Timeout=300000";
        connString = $"Data Source={Guid.NewGuid().ToString()}:memory:";

        connection = new SqliteConnection(this.connString);
        connection.Open();

        var optionsBuilder = new DbContextOptionsBuilder<SCA_ITSContext>();
        optionsBuilder.UseSqlite(connection);

        // var optionsBuilder = new DbContextOptionsBuilder<SCA_ITSContext>();
        // optionsBuilder.UseMySql(connString, ServerVersion.AutoDetect(connString));

        _context = new SCA_ITSContext(optionsBuilder.Options);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                    typeof(DbContextOptions<SCA_ITSContext>));

            services.Remove(descriptor);

            // services.AddDbContext<SCA_ITSContext>(options =>
            // {
            //     options.UseMySql(connString, ServerVersion.AutoDetect(connString));
            // });

            services.AddDbContext<SCA_ITSContext>(options =>
            {
                options.UseSqlite(connString);
            });

            var sp = services.BuildServiceProvider();

            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<SCA_ITSContext>();
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