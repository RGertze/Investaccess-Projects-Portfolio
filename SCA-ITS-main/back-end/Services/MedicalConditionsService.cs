using System.Data;
using Microsoft.EntityFrameworkCore;
using PuppeteerSharp;
using PuppeteerSharp.Media;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class MedicalConditionsService
{
    private readonly SCA_ITSContext dbContext;
    private IViewRenderService _viewRenderService;

    public MedicalConditionsService(SCA_ITSContext dbContext, IViewRenderService viewRenderService)
    {
        this.dbContext = dbContext;
        this._viewRenderService = viewRenderService;
    }

    /*----   GET ALL   ----*/
    public async Task<Response> GetAll()
    {
        try
        {
            var records = await dbContext.MedicalConditions.ToListAsync();

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
}