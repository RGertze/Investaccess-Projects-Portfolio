using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class NonScaSiblingService
{
    private readonly SCA_ITSContext dbContext;
    private IViewRenderService _viewRenderService;

    public NonScaSiblingService(SCA_ITSContext dbContext, IViewRenderService viewRenderService)
    {
        this.dbContext = dbContext;
        this._viewRenderService = viewRenderService;
    }

    /*----   GET ALL FOR STUDENT   ----*/
    public async Task<Response> GetAllForStudent(string studentNumber)
    {
        try
        {
            var records = await dbContext.NonScaSiblings.Where(sib => sib.StudentNumber == studentNumber).ToListAsync();

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

    /*----   ADD   ----*/
    public async Task<Response> Add(AddNonScaSibling details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            if (!await dbContext.Students.AnyAsync(stu => stu.StudentNumber == details.studentNumber))
                return new Response { errorMessage = "Student not found", data = 404 };

            await dbContext.NonScaSiblings.AddAsync(new NonScaSibling
            {
                StudentNumber = details.studentNumber,
                Name = details.name,
                Age = (int)details.age
            });
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

    /*----   EDIT   ----*/
    public async Task<Response> Edit(EditNonScaSibling details)
    {
        try
        {
            if (details.id is null)
                return new Response { errorMessage = "Empty values", data = 400 };

            var sibling = await dbContext.NonScaSiblings.FirstOrDefaultAsync(sib => sib.Id == details.id);
            if (sibling is null)
                return new Response { errorMessage = "Record not found", data = 404 };

            sibling.Name = details.name ?? sibling.Name;
            sibling.Age = details.age ?? sibling.Age;

            dbContext.NonScaSiblings.Update(sibling);
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

    /*----   DELETE   ----*/
    public async Task<Response> Delete(int id)
    {
        try
        {
            var sibling = await dbContext.NonScaSiblings.FirstOrDefaultAsync(sib => sib.Id == id);
            if (sibling is null)
                return new Response { errorMessage = "Record not found", data = 404 };

            dbContext.NonScaSiblings.Remove(sibling);
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