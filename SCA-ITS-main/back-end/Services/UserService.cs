using System.Data;
using Microsoft.EntityFrameworkCore;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Response = SCA_ITS_back_end.Models.Response;

namespace SCA_ITS_back_end.Services;

public class UserService
{
    private readonly SCA_ITSContext dbContext;
    private MoodleService moodleService;

    public UserService(SCA_ITSContext dbContext, MoodleService moodleService)
    {
        this.dbContext = dbContext;
        this.moodleService = moodleService;
    }

    /*----  EDIT   ----*/
    public async Task<Response> Edit(UserUpdateRequest details, bool updateMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // get user
            var user = await dbContext.UserAccounts.Where(p => p.Email == details.email).FirstOrDefaultAsync();
            if (user is null)
            {
                return new Response { errorMessage = "User not found!", data = 404 };
            }

            // update user values
            user.FirstName = (user.FirstName == details.firstName || details.firstName is null) ? user.FirstName : details.firstName;
            user.LastName = (user.LastName == details.lastName || details.lastName is null) ? user.LastName : details.lastName;

            // update db
            dbContext.UserAccounts.Update(user);
            await dbContext.SaveChangesAsync();

            // edit moodle user if staff member
            if (user.UserTypeId == 3 && updateMoodle)
            {
                var result = await moodleService.EditUserByUsername(user.Email, new MoodleUpdateUserRequest
                {
                    firstname = user.FirstName,
                    lastname = user.LastName
                });
                if (result.errorMessage != "")
                    return new Response { errorMessage = "Failed to update moodle user: " + result.errorMessage, data = result.data };
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE   ----*/
    public async Task<Response> Delete(int userId, bool deleteFromMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var user = await dbContext.UserAccounts.Where(u => u.UserId == userId).FirstOrDefaultAsync();
            if (user is null)
            {
                return new Response { errorMessage = "user not found", data = 404 };
            }

            //___  PREVENT DEFAULT PARENT FROM BEING DELETED  ___
            if (user.UserId == 2)
                return new Response { errorMessage = "This user cannot be deleted!", data = 403 };
            //---------------------------------------------------


            dbContext.UserAccounts.Remove(user);
            await dbContext.SaveChangesAsync();

            // remove from moodle if staff member
            if (user.UserTypeId == 3 && deleteFromMoodle)
            {
                var result = await moodleService.DeleteUserByUsername(user.Email);

                if (result.errorMessage != "" && result.data != 404)
                {
                    return new Response { errorMessage = "Failed to delete moodle user: " + result.errorMessage, data = result.data };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  DELETE BY EMAIL   ----*/
    public async Task<Response> DeleteByEmail(string email, bool deleteFromMoodle)
    {
        try
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            var user = await dbContext.UserAccounts.Where(u => u.Email == email).FirstOrDefaultAsync();
            if (user is null)
            {
                return new Response { errorMessage = "user not found", data = 404 };
            }

            dbContext.UserAccounts.Remove(user);
            await dbContext.SaveChangesAsync();

            // remove from moodle if staff member
            if (user.UserTypeId == 3 && deleteFromMoodle)
            {
                var result = await moodleService.DeleteUserByUsername(user.Email);

                if (result.errorMessage != "" && result.data != 404)
                {
                    return new Response { errorMessage = "Failed to delete moodle user: " + result.errorMessage, data = result.data };
                }
            }

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }

    /*----  EDIT PASSWORD   ----*/
    public async Task<Response> EditPassword(UpdateUserPassword details)
    {
        try
        {
            if (BaseRequest.IsNullOrEmpty(details))
                return new Response { errorMessage = "Empty values!", data = 400 };

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            // get user
            var user = await dbContext.UserAccounts.Where(p => p.UserId == details.userId).FirstOrDefaultAsync();
            if (user is null)
                return new Response { errorMessage = "User not found!", data = 404 };

            // update user values
            user.Password = details.password;

            // update db
            dbContext.UserAccounts.Update(user);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return new Response { errorMessage = "error occured: " + ex.Message, data = 500 };
        }
    }
}