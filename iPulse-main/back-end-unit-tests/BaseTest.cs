using iPulse_back_end.DB_Models;
using back_end_unit_tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace back_end_unit_tests;

public class BaseTest : IDisposable
{
    string connString = $"server=localhost; port=3306; database=IPulse_Test_{Guid.NewGuid().ToString()}; user=dev; password=Dev@1234; Persist Security Info=False; Connect Timeout=300000";
    public IPulseContext dbContext;

    public BaseTest()
    {
        var optionsBuilder = new DbContextOptionsBuilder<IPulseContext>();
        optionsBuilder.UseMySql(this.connString, ServerVersion.AutoDetect(connString));

        this.dbContext = new IPulseContext(optionsBuilder.Options);
        this.dbContext.Database.EnsureCreated();

        try
        {
            DB_Init.InitDbForTests(this.dbContext);
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred setting up the database. Error: " + ex.Message);
        }
    }

    public void Dispose()
    {
        if (dbContext != null)
        {
            dbContext.Database.EnsureDeleted();
        }
    }
}