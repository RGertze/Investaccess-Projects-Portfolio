using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public interface IReportGroupService
{
    public Task<Response> Delete(int id);
}

public class ReportGroupService : IReportGroupService
{
    private readonly SCA_ITSContext dbContext;
    private readonly FilesToDeleteService filesToDeleteService;
    public ReportGroupService(SCA_ITSContext dbContext, FilesToDeleteService filesToDeleteService)
    {
        this.dbContext = dbContext;
        this.filesToDeleteService = filesToDeleteService;
    }

    /*----  DELETE   ----*/
    /// <summary>
    ///     deletes a report group and adds all of the generated files of that group to the files to delete table
    /// </summary>
    /// <param name="id">id of report group to delete</param>
    /// <returns>A response indicating success or failure.</returns>
    public async Task<Response> Delete(int id)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var reportGroup = await dbContext.ReportGroups.FirstOrDefaultAsync(rg => rg.Id == id);
            if (reportGroup is null)
                return new Response { errorMessage = "Not found", data = 404 };

            var generatedReports = await (
                from rg in dbContext.ReportGroups
                join gj in dbContext.ReportGenerationJobs on rg.Id equals gj.ReportGroupId
                join grf in dbContext.GeneratedReportFiles on gj.Id equals grf.JobId
                where rg.Id == id
                select grf
            ).ToListAsync();

            dbContext.GeneratedReportFiles.RemoveRange(generatedReports);
            dbContext.ReportGroups.Remove(reportGroup);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

}