using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class StudentMedicalConditionsService
{
    private readonly SCA_ITSContext dbContext;
    private IViewRenderService _viewRenderService;

    public StudentMedicalConditionsService(SCA_ITSContext dbContext, IViewRenderService viewRenderService)
    {
        this.dbContext = dbContext;
        this._viewRenderService = viewRenderService;
    }

    /*----   GET ALL FOR STUDENT   ----*/
    public async Task<Response> GetAllForStudent(string studentNumber)
    {
        try
        {
            var records = await (
                from s in dbContext.Students
                join md in dbContext.StudentMedicalConditions on s.StudentNumber equals md.StudentNumber
                join m in dbContext.MedicalConditions on md.MedicalId equals m.Id
                where s.StudentNumber == studentNumber
                select m
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


    /*----  EDIT STUDENT MEDICAL CONDITIONS   ----*/
    public async Task<Response> EditStudentMedicalConditions(EditStudentMedicalCondition details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values", data = 400 };

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // check if student exists
            var student = await dbContext.Students.Where(u => u.StudentNumber == details.studentNumber).FirstOrDefaultAsync();
            if (student is null)
            {
                return new Response { errorMessage = "Student not found", data = 404 };
            }

            var currentConditions = await dbContext.StudentMedicalConditions.Where(smc => smc.StudentNumber == details.studentNumber).ToListAsync();

            // delete existing conditions
            dbContext.RemoveRange(currentConditions);
            await dbContext.SaveChangesAsync();

            // add new ones
            var conditionsToAdd = new List<StudentMedicalCondition>();
            foreach (var conditionId in details.conditionIds)
            {

                // check if id exists
                if (!await dbContext.MedicalConditions.AnyAsync(mc => mc.Id == conditionId))
                    return new Response { errorMessage = "Medical condition not found", data = 404 };

                conditionsToAdd.Add(new StudentMedicalCondition
                {
                    StudentNumber = details.studentNumber,
                    MedicalId = conditionId
                });
            }
            await dbContext.StudentMedicalConditions.AddRangeAsync(conditionsToAdd);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "ok" } };
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