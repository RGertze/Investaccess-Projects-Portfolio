using iPulse_back_end.DB_Models;
using iPulse_back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace iPulse_back_end.Services;

public class NextOfKinService : IBaseService<int, AddPatientNextOfKin, EditPatientNextOfKin>
{
    private IPulseContext dbContext;

    public NextOfKinService(IPulseContext dbContext)
    {
        this.dbContext = dbContext;
    }

    private async Task initDb()
    {

    }

    /// <summary>Get a single patient next of kin</summary>
    /// <param name="kinId">Id of the kin to get</param>
    /// <returns>A response object including either an error message or the data retrieved</returns>
    public async Task<Response> GetOne(int kinId)
    {
        try
        {
            var nextOfKin = await dbContext.PatientNextOfKins.Where(kin => kin.PatientNextOfKinId == kinId).FirstOrDefaultAsync();
            if (nextOfKin is null)
            {
                return new Response { errorMessage = "Record not found", data = 404 };
            }

            return new Response { errorMessage = "", data = nextOfKin };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "server error, try again later", data = 500 };
        }
    }

    /// <summary>Get all next of kin of a patient</summary>
    /// <param name="patientId">Id of the patient for which to get kin</param>
    /// <returns>A response object including either an error message or the data retrieved</returns>
    public async Task<Response> GetAllBy(int patientId)
    {
        try
        {
            var nextOfKin = await dbContext.PatientNextOfKins.Where(kin => kin.PatientId == patientId)
            .ToListAsync();

            return new Response { errorMessage = "", data = nextOfKin };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "server error, try again later", data = 500 };
        }
    }

    /// <summary>Add patient next of kin</summary>
    /// <param name="details">The details of the next of kin.</param>
    /// <returns>A response object including an error which if empty indicates success</returns>
    public async Task<Response> Add(AddPatientNextOfKin details)
    {
        // check for empty or null values
        if (BaseRequest.IsNullOrEmpty(details))
        {
            return new Response { errorMessage = "Invalid data!", data = 400 };
        }

        try
        {
            // check if patient exists
            if (!(await dbContext.PatientProfiles.AnyAsync(d => d.UserId == details.patientId)))
            {
                return new Response { errorMessage = "Patient not found!", data = 404 };
            }

            // add next of kin
            PatientNextOfKin nextOfKin = new PatientNextOfKin()
            {
                PatientId = (int)details.patientId,
                FullName = details.fullName,
                Cellphone = details.cellPhone,
                Email = details.email,
                ResidentialAddress = details.residentialAddress,
                Relationship = details.relationship,
            };

            // add to db
            await dbContext.PatientNextOfKins.AddAsync(nextOfKin);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "successful" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "server error, try again later", data = 500 };
        }
    }

    /// <summary>Edit patient next of kin</summary>
    /// <param name="details">The details of the next of kin.</param>
    /// <returns>A response object including an error which if empty indicates success</returns>
    public async Task<Response> Edit(EditPatientNextOfKin details)
    {
        try
        {
            // check if record exists
            var record = await dbContext.PatientNextOfKins.Where(kin => kin.PatientNextOfKinId == details.id).FirstOrDefaultAsync();
            if (record is null)
            {
                return new Response { errorMessage = "record not found!", data = 404 };
            }

            // update next of kin
            record.FullName = details.fullName ?? record.FullName;
            record.Cellphone = details.cellPhone ?? record.Cellphone;
            record.Email = details.email ?? record.Email;
            record.ResidentialAddress = details.residentialAddress ?? record.ResidentialAddress;
            record.Relationship = details.relationship ?? record.Relationship;

            // update db
            dbContext.PatientNextOfKins.Update(record);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "successful" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "server error, try again later", data = 500 };
        }
    }

    /// <summary>Deletes a patient's next of kin.</summary>
    /// <param name="id">The patient's next of kin's id.</param>
    /// <returns>A response object indicating success or failure.</returns>
    public async Task<Response> Delete(int id)
    {
        try
        {
            var nextOfKin = await dbContext.PatientNextOfKins.Where(wh => wh.PatientNextOfKinId == id).FirstOrDefaultAsync();
            if (nextOfKin is null)
            {
                return new Response { errorMessage = "Next of kin does not exist", data = 404 };
            }

            dbContext.PatientNextOfKins.Remove(nextOfKin);
            await dbContext.SaveChangesAsync();

            return new Response { errorMessage = "", data = new { message = "success" } };
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.TargetSite);
            return new Response { errorMessage = "server error, try again later", data = 500 };
        }
    }
}

