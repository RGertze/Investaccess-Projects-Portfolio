using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class ParentsService
{
    private readonly SCA_ITSContext dbContext;
    private FinancialStatementService financialStatementService;

    public ParentsService(SCA_ITSContext dbContext, FinancialStatementService financialStatementService)
    {
        this.dbContext = dbContext;
        this.financialStatementService = financialStatementService;
    }

    /*----   GET ALL   ----*/
    public async Task<Response> GetAll()
    {
        try
        {
            var parents = await (
                from u in dbContext.UserAccounts
                join p in dbContext.Parents on u.UserId equals p.UserId
                // where u.IsApproved == 1
                select new
                {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    p.RegistrationStage,
                    CreatedAt = u.CreatedAt.ToString()
                }
            ).ToListAsync();

            return new Response { errorMessage = "", data = parents };
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
    public async Task<Response> Edit(EditParentProfileRequest details)
    {
        try
        {
            if (details.userId is null)
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            var parent = await dbContext.Parents.Where(p => p.UserId == details.userId).FirstOrDefaultAsync();
            if (parent is null)
                return new Response { errorMessage = "Parent not found", data = 404 };

            // edit parent
            parent.IdNumber = details.idNumber ?? parent.IdNumber;
            parent.Employer = details.employer ?? parent.Employer;
            parent.Occupation = details.occupation ?? parent.Occupation;
            parent.MonthlyIncome = details.monthlyIncome ?? parent.MonthlyIncome;
            parent.WorkingHours = details.workingHours ?? parent.WorkingHours;
            parent.SpecialistSkillsHobbies = details.specialistSkillsHobbies ?? parent.SpecialistSkillsHobbies;
            parent.TelephoneWork = details.telephoneWork ?? parent.TelephoneWork;
            parent.TelephoneHome = details.telephoneHome ?? parent.TelephoneHome;
            parent.Fax = details.fax ?? parent.Fax;
            parent.CellNumber = details.cellNumber ?? parent.CellNumber;
            parent.PostalAddress = details.postalAddress ?? parent.PostalAddress;
            parent.ResidentialAddress = details.residentialAddress ?? parent.ResidentialAddress;
            parent.MaritalStatus = details.maritalStatus ?? parent.MaritalStatus;
            parent.RegistrationStage = details.registrationStage ?? parent.RegistrationStage;

            dbContext.Parents.Update(parent);
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
    public async Task<Response> Add(AddNewParentRequest details, bool isActive, bool isApproved, bool isConfirmed)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            // check if user exists
            if (await dbContext.UserAccounts.AnyAsync(u => u.Email == details.email))
            {
                return new Response { errorMessage = "A parent with that email already exists", data = 409 };
            }

            // create new user
            var user = new UserAccount()
            {
                Email = details.email,
                FirstName = details.firstName,
                LastName = details.lastName,
                Password = details.password,
                ConfirmationCode = Guid.NewGuid().ToString(),
                IsActive = (ulong)(isActive ? 1 : 0),
                IsApproved = (ulong)(isApproved ? 1 : 0),
                IsConfirmed = (ulong)(isConfirmed ? 1 : 0),
                UserTypeId = 2        // parent user type
            };

            // store in db
            await dbContext.UserAccounts.AddAsync(user);
            await dbContext.SaveChangesAsync();

            // add profile
            var result = await AddParentProfile(isApproved, user.UserId);
            if (result.errorMessage != "")
            {
                return result;
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = 500 };
        }
    }

    /*----  ADD PARENT PROFILE   ----*/
    private async Task<Response> AddParentProfile(bool isApproved, int userId)
    {
        try
        {
            // check if parent exists
            if (!await dbContext.UserAccounts.AnyAsync(u => u.UserId == userId && u.UserTypeId == 2))
                return new Response { errorMessage = "parent not found", data = 404 };

            // create parent profile
            var profile = new Parent()
            {
                UserId = userId,
                RegistrationStage = isApproved ? (int)PARENT_REGISTRATION_STATUS.APPROVED : (int)PARENT_REGISTRATION_STATUS.ADD_DETAILS
            };

            await dbContext.Parents.AddAsync(profile);
            await dbContext.SaveChangesAsync();

            // create registration status
            var regStatus = new ParentRegistrationStatus
            {
                ParentId = profile.UserId,
                DetailsAdded = 0,
                OtherParentsAdded = 0,
                StudentsAdded = 0,
                RequiredDocsAdded = 0,
                RegistrationFeePaid = 0
            };
            await dbContext.ParentRegistrationStatuses.AddAsync(regStatus);
            await dbContext.SaveChangesAsync();

            // add statement for parent
            var result = await financialStatementService.AddStatementForParent(profile.UserId);
            if (result.errorMessage != "")
                return result;

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured while trying to retrieve data. Try again later.", data = 500 };
        }
    }
}