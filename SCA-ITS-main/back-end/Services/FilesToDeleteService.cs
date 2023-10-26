using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class FilesToDeleteService
{
    private readonly SCA_ITSContext dbContext;

    public FilesToDeleteService(SCA_ITSContext dbContext)
    {
        this.dbContext = dbContext;
    }

    /*----   GET ALL   ----*/
    public async Task<Response> GetAll()
    {
        try
        {
            var records = await dbContext.FileToDeletes.ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----   GET ALL FILES   ----*/
    public async Task<Response> GetAllFiles()
    {
        try
        {
            List<Models.File> records = new List<Models.File>();

            records.AddRange(await dbContext.ParentRegistrationFiles.Select(f => new Models.File { filePath = f.FilePath, fileName = f.Name ?? "" }).ToListAsync());
            records.AddRange(await dbContext.ParentRegistrationPaymentFiles.Select(f => new Models.File { filePath = f.FilePath, fileName = f.FileName ?? "" }).ToListAsync());
            records.AddRange(await dbContext.StudentOccupationalTherapyFiles.Select(f => new Models.File { filePath = f.FilePath, fileName = f.FileName ?? "" }).ToListAsync());
            records.AddRange(await dbContext.StudentRegistrationFiles.Select(f => new Models.File { filePath = f.FilePath, fileName = f.Name ?? "" }).ToListAsync());
            records.AddRange(await dbContext.GeneratedReportFiles.Where(f => (f.FilePath != null) && f.FilePath.Length > 0).Select(f => new Models.File { filePath = f.FilePath ?? "", fileName = f.FilePath ?? "" }).ToListAsync());
            records.AddRange(await dbContext.ProofOfDeposits.Where(f => (f.FilePath != null) && f.FilePath.Length > 0).Select(f => new Models.File { filePath = f.FilePath ?? "", fileName = f.FilePath ?? "" }).ToListAsync());

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }



    /*----  ADD MANY   ----*/
    public async Task<Response> AddMany(List<AddFileToDelete> details)
    {
        try
        {
            var records = new List<FileToDelete>();
            for (int i = 0; i < details.Count; i++)
            {
                var file = details[i];

                if (BaseRequest.IsNullOrEmpty(file))
                    return new Response { errorMessage = "One of the files values was empty", data = 400 };

                if (await dbContext.FileToDeletes.AnyAsync(f => f.FilePath == file.filePath))
                    continue;

                records.Add(new FileToDelete()
                {
                    FilePath = file.filePath,
                    FileName = file.fileName
                });
            }

            dbContext.FileToDeletes.AddRange(records);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE MANY   ----*/
    public async Task<Response> DeleteMany(List<DeleteFileToDelete> details)
    {
        try
        {
            var records = new List<FileToDelete>();
            for (int i = 0; i < details.Count; i++)
            {
                var file = details[i];

                if (BaseRequest.IsNullOrEmpty(file))
                    return new Response { errorMessage = "One of the files values was empty", data = 400 };

                var record = await dbContext.FileToDeletes.FirstOrDefaultAsync(f => f.FilePath == file.filePath);
                if (record is null)
                    return new Response { errorMessage = "One of the files was not found", data = 404 };

                records.Add(record);
            }

            dbContext.FileToDeletes.RemoveRange(records);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error: " + ex.Message, data = 500 };
        }
    }


}