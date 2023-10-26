using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Utilities;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class StaffService
{
    private readonly SCA_ITSContext dbContext;
    private MoodleService moodleService;

    public StaffService(SCA_ITSContext dbContext, MoodleService moodleService)
    {
        this.dbContext = dbContext;
        this.moodleService = moodleService;
    }

    #region GET

    /*----   GET ONE   ----*/
    public async Task<Response> GetOne(int staffId)
    {
        try
        {
            var staff = await dbContext.UserAccounts.Where(u => u.UserId == staffId && u.UserTypeId == 3).Select(u => new
            {
                u.UserId,
                u.FirstName,
                u.LastName,
                u.Email
            }).FirstOrDefaultAsync();

            if (staff is null)
                return new Response { errorMessage = "Staff not found", data = 404 };

            return new Response { errorMessage = "", data = staff };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.Source);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "Server error, try again later", data = 500 };
        }
    }

    /*----   GET ALL   ----*/
    public async Task<Response> GetAll()
    {
        try
        {
            var records = await dbContext.UserAccounts.Where(u => u.UserTypeId == 3).Select(u => new
            User
            {
                UserId = u.UserId,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email
            }).ToListAsync();

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


    #endregion

    /*----  ADD   ----*/
    public async Task<Response> Add(AddStaffRequest details, bool addToMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            if (BaseRequest.IsNullOrEmpty(details))
            {
                return new Response { errorMessage = "empty values", data = 400 };
            }

            // check if account with email already exists
            if (await dbContext.UserAccounts.AnyAsync(u => u.Email == details.email))
            {
                return new Response { errorMessage = "That email is already in use", data = 409 };
            }

            // create new staff
            var staff = new UserAccount()
            {
                UserTypeId = 3,
                Email = details.email,
                FirstName = details.firstName,
                LastName = details.lastName,
                Password = details.password,
                ConfirmationCode = Guid.NewGuid().ToString(),
                IsActive = 1,
                IsApproved = 1,
                IsConfirmed = 1
            };

            // store in db
            await dbContext.UserAccounts.AddAsync(staff);
            await dbContext.SaveChangesAsync();

            // create moodle user for staff

            if (addToMoodle)
            {
                var addMoodleUserReq = new MoodleAddUserRequest()
                {
                    username = staff.Email,
                    firstname = staff.FirstName,
                    lastname = staff.LastName,
                    email = staff.Email,
                    password = staff.Password
                };

                var result = await moodleService.AddUser(addMoodleUserReq);

                if (result.errorMessage.Length > 0)
                {
                    return new Response { errorMessage = "Failed to create moodle user", data = 500 };
                }
            }

            //-------------------------------

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

}