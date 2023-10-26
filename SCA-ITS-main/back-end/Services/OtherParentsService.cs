using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class OtherParentsService
{
    private readonly SCA_ITSContext dbContext;

    public OtherParentsService(SCA_ITSContext dbContext)
    {
        this.dbContext = dbContext;
    }

    /*----   GET ALL FOR PARENT   ----*/
    public async Task<Response> GetAllForParent(int id)
    {
        try
        {
            var records = await dbContext.OtherParents.Where(p => p.MainParentId == id).ToListAsync();

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
    public async Task<Response> Edit(EditOtherParent details)
    {
        try
        {
            if (details.id is null)
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            var record = await dbContext.OtherParents.Where(p => p.Id == details.id).FirstOrDefaultAsync();
            if (record is null)
                return new Response { errorMessage = "Record not found", data = 404 };

            record.FirstName = details.firstName ?? record.FirstName;
            record.LastName = details.lastName ?? record.LastName;
            record.IdNumber = details.idNumber ?? record.IdNumber;
            record.Employer = details.employer ?? record.Employer;
            record.Occupation = details.occupation ?? record.Occupation;
            record.MonthlyIncome = details.monthlyIncome ?? record.MonthlyIncome;
            record.WorkingHours = details.workingHours ?? record.WorkingHours;
            record.SpecialistSkillsHobbies = details.specialistSkillsHobbies ?? record.SpecialistSkillsHobbies;
            record.TelephoneWork = details.telephoneWork ?? record.TelephoneWork;
            record.TelephoneHome = details.telephoneHome ?? record.TelephoneHome;
            record.Fax = details.fax ?? record.Fax;
            record.CellNumber = details.cellNumber ?? record.CellNumber;
            record.PostalAddress = details.postalAddress ?? record.PostalAddress;
            record.ResidentialAddress = details.residentialAddress ?? record.ResidentialAddress;
            record.MaritalStatus = details.maritalStatus ?? record.MaritalStatus;

            dbContext.OtherParents.Update(record);
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

    /*----  ADD   ----*/
    public async Task<Response> Add(AddOtherParent details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            if (!await dbContext.Parents.AnyAsync(p => p.UserId == details.mainParentId))
                return new Response { errorMessage = "Main parent not found", data = 404 };

            var record = new OtherParent()
            {
                MainParentId = (int)details.mainParentId,
                FirstName = details.firstName,
                LastName = details.lastName,
                IdNumber = details.idNumber,
                Employer = details.employer,
                Occupation = details.occupation,
                MonthlyIncome = details.monthlyIncome,
                WorkingHours = details.workingHours,
                SpecialistSkillsHobbies = details.specialistSkillsHobbies,
                TelephoneWork = details.telephoneWork,
                TelephoneHome = details.telephoneHome,
                Fax = details.fax,
                CellNumber = details.cellNumber,
                PostalAddress = details.postalAddress,
                ResidentialAddress = details.residentialAddress,
                MaritalStatus = details.maritalStatus,
            };

            // store in db
            await dbContext.OtherParents.AddAsync(record);
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
    public async Task<Response> Delete(int id)
    {
        try
        {
            var record = await dbContext.OtherParents.FirstOrDefaultAsync(p => p.Id == id);
            if (record is null)
                return new Response { errorMessage = "Record not found", data = 404 };

            dbContext.OtherParents.Remove(record);
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