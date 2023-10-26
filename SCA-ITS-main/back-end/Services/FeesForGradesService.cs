using System.Data;
using Microsoft.EntityFrameworkCore;
using PuppeteerSharp;
using PuppeteerSharp.Media;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class FeesForGradesService
{
    private readonly SCA_ITSContext dbContext;
    private IViewRenderService _viewRenderService;

    public FeesForGradesService(SCA_ITSContext dbContext, IViewRenderService viewRenderService)
    {
        this.dbContext = dbContext;
        this._viewRenderService = viewRenderService;
    }

    /*----   GET ALL   ----*/
    public async Task<Response> GetAll()
    {
        try
        {
            var records = await dbContext.FeesForGrades.ToListAsync();

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


    /*----  EDIT   ----*/
    public async Task<Response> Edit(EditFeeForGrade details)
    {
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return new Response { errorMessage = "Empty values", data = 400 };
        }
        try
        {
            var record = await dbContext.FeesForGrades.FirstOrDefaultAsync(fee => fee.Grade == details.grade);
            if (record is null)
                return new Response { errorMessage = "Not found", data = 404 };

            // check if amount >= 0
            if (details.amount < 0)
                return new Response { errorMessage = "Amount cannot be less than 0", data = 400 };

            record.Amount = (decimal)details.amount;

            dbContext.FeesForGrades.Update(record);
            await dbContext.SaveChangesAsync();

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