using back_end.Models;
using back_end.Data;
using back_end_unit_tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Xunit.Abstractions;

namespace back_end_unit_tests;

public class BaseTest : IDisposable
{
    // string connString = $"server=localhost; port=3306; database=SCA_ITS_Test_{Guid.NewGuid().ToString()}; user=dev; password=Dev@1234; Persist Security Info=False; Connect Timeout=300000";
    string connString = $"Data Source=:memory:";
    public ApplicationDBContext dbContext;

    public BaseTest()
    {

        var connection = new SqliteConnection(this.connString);
        connection.Open();

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDBContext>();
        optionsBuilder.UseSqlite(connection);

        this.dbContext = new ApplicationDBContext(optionsBuilder.Options);

        var res = this.dbContext.Database.EnsureDeleted();
        res = this.dbContext.Database.EnsureCreated();


        try
        {
            DB_Init.InitDbForTests(this.dbContext);
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred setting up the database. Error: " + ex.Message);
            Console.WriteLine(ex.InnerException);
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