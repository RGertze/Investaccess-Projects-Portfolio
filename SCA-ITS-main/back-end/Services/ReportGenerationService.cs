using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class ReportGenerationService
{
    private readonly SCA_ITSContext dbContext;
    private FilesToDeleteService filesToDeleteService;

    public ReportGenerationService(SCA_ITSContext dbContext, FilesToDeleteService filesToDeleteService)
    {
        this.dbContext = dbContext;
        this.filesToDeleteService = filesToDeleteService;
    }

    /*----  DELETE JOB   ----*/
    /// <summary>
    ///     deletes a report generation job and moves all of the generated reports to the files to delete table.
    /// </summary>
    /// <param name="id">id of job to delete</param>
    /// <returns></returns>
    public async Task<Response> DeleteJob(int id)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var generationJob = await dbContext.ReportGenerationJobs.FirstOrDefaultAsync(rgj => rgj.Id == id);
            if (generationJob is null)
            {
                return new Response { errorMessage = "Not found", data = 404 };
            }

            var files = await dbContext.GeneratedReportFiles.Where(grf => grf.JobId == id && !string.IsNullOrEmpty(grf.FilePath))
            .Select(gfr => new AddFileToDelete()
            {
                filePath = gfr.FilePath,
                fileName = gfr.Id.ToString()
            })
            .ToListAsync();

            var result = await filesToDeleteService.AddMany(files);
            if (result.errorMessage != "")
                return result;

            dbContext.ReportGenerationJobs.Remove(generationJob);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    #region Rerun files

    /*----  RERUN ALL FILES   ----*/
    /// <summary>
    ///     Sets the status a job and all its files to pending
    /// </summary>
    /// <param name="id">id of job to rerun</param>
    /// <returns></returns>
    public async Task<Response> RerunAllFiles(int id)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var job = await dbContext.ReportGenerationJobs.FirstOrDefaultAsync(j => j.Id == id);
            if (job is null)
                return new Response { errorMessage = "Job Not found", data = 404 };

            var files = await dbContext.GeneratedReportFiles.Where(f => f.JobId == id).ToListAsync();
            var filesToDelete = new List<AddFileToDelete>();
            for (int i = 0; i < files.Count; i++)
            {
                files[i].Status = (int)FileStatus.PENDING;

                if (!String.IsNullOrEmpty(files[i].FilePath))
                {
                    filesToDelete.Add(new AddFileToDelete
                    {
                        fileName = files[i].ReportId.ToString(),
                        filePath = files[i].FilePath
                    });
                }
            }

            var result = await filesToDeleteService.AddMany(filesToDelete);
            if (result.errorMessage != "")
                return result;

            job.Status = (int)FileStatus.PENDING;

            dbContext.GeneratedReportFiles.UpdateRange(files);
            dbContext.ReportGenerationJobs.Update(job);

            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  RERUN SINGLE FILE   ----*/
    /// <summary>
    ///     Sets the status of a single file to pending and sets the status of the job of that file to pending aswell
    /// </summary>
    /// <param name="id">id of generated file to rerun</param>
    /// <returns></returns>
    public async Task<Response> RerunSingleFile(int id)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var file = await dbContext.GeneratedReportFiles.FirstOrDefaultAsync(f => f.Id == id);
            if (file is null)
                return new Response { errorMessage = "File Not found", data = 404 };

            var job = await dbContext.ReportGenerationJobs.FirstOrDefaultAsync(j => j.Id == file.JobId);
            if (job is null)
                return new Response { errorMessage = "Job Not found", data = 404 };

            if (!String.IsNullOrEmpty(file.FilePath))
            {
                var result = await filesToDeleteService.AddMany(new List<AddFileToDelete>()
                {
                    new AddFileToDelete{
                        fileName=file.ReportId.ToString(),
                        filePath=file.FilePath
                    }
                });
                if (result.errorMessage != "")
                    return result;
            }

            file.Status = (int)FileStatus.PENDING;
            file.FailureMessage = "";
            file.FilePath = "";

            job.Status = (int)FileStatus.PENDING;

            dbContext.GeneratedReportFiles.Update(file);
            dbContext.ReportGenerationJobs.Update(job);

            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    #endregion
}