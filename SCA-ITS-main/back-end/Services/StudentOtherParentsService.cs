using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class StudentOtherParentsService
{
    private readonly SCA_ITSContext dbContext;

    public StudentOtherParentsService(SCA_ITSContext dbContext)
    {
        this.dbContext = dbContext;
    }

    /*----   GET ALL FOR STUDENT   ----*/
    public async Task<Response> GetAllForStudent(string studentNumber)
    {
        try
        {
            var records = await (
                from sp in dbContext.StudentOtherParents
                join p in dbContext.OtherParents on sp.ParentId equals p.Id
                where sp.StudentNumber == studentNumber
                select p
            ).ToListAsync();

            return new Response { errorMessage = "", data = records };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }


    /*----  ADD   ----*/
    public async Task<Response> Add(AddOtherStudentParent details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            if (await dbContext.StudentOtherParents.AnyAsync(p => p.ParentId == details.parentId && p.StudentNumber == details.studentNumber))
                return new Response { errorMessage = "Already Exists", data = 409 };

            if (!await dbContext.OtherParents.AnyAsync(p => p.Id == details.parentId))
                return new Response { errorMessage = "Parent not found", data = 404 };

            if (!await dbContext.Students.AnyAsync(s => s.StudentNumber == details.studentNumber))
                return new Response { errorMessage = "Student not found", data = 404 };

            var record = new StudentOtherParent()
            {
                ParentId = (int)details.parentId,
                StudentNumber = details.studentNumber
            };

            // store in db
            await dbContext.StudentOtherParents.AddAsync(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = 500 };
        }
    }

    /*----   DELETE   ----*/
    public async Task<Response> Delete(int parentId, string studentNumber)
    {
        try
        {
            var record = await dbContext.StudentOtherParents.FirstOrDefaultAsync(p => p.ParentId == parentId && p.StudentNumber == studentNumber);
            if (record is null)
                return new Response { errorMessage = "Record not found", data = 404 };

            dbContext.StudentOtherParents.Remove(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = "ok" };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }
}