using iPulse_back_end.DB_Models;
using iPulse_back_end.Models;
using iPulse_back_end.Services;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace back_end_unit_tests;

public class NextOfKinTests : BaseTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private NextOfKinService _nextOfKinService;

    public NextOfKinTests(ITestOutputHelper testOutputHelper)
    {
        this._testOutputHelper = testOutputHelper;

        this._nextOfKinService = new NextOfKinService(this.dbContext);
    }

    #region Get tests

    [Fact]
    public async Task GetAllForPatientValid()
    {
        var res = await _nextOfKinService.GetAllBy(4);
        Assert.Equal(res.errorMessage, "");

        var nextOfKin = (List<PatientNextOfKin>)res.data;
        Assert.Equal(nextOfKin.Count, 2);

        Assert.Equal(nextOfKin[0].Email, "em");
    }

    [Fact]
    public async Task GetAllForPatientInvalid_PatientDoesNotExist()
    {
        var res = await _nextOfKinService.GetAllBy(5000);
        var nextOfKin = (List<PatientNextOfKin>)res.data;
        Assert.Equal(nextOfKin.Count, 0);
    }

    #endregion

    #region Add tests

    [Fact]
    public async Task AddNextOfKinValid()
    {
        var nextOfKin = new AddPatientNextOfKin()
        {
            patientId = 4,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        };

        var res = await _nextOfKinService.Add(nextOfKin);
        Assert.Equal(res.errorMessage, "");
    }

    [Fact]
    public async Task AddNextOfKinInvalid_PatientNotFound()
    {
        var nextOfKin = new AddPatientNextOfKin()
        {
            patientId = 40000,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        };

        var res = await _nextOfKinService.Add(nextOfKin);
        Assert.Equal(res.data, 404);
    }

    [Fact]
    public async Task AddNextOfKinInvalid_EmptyValues()
    {
        var nextOfKin = new AddPatientNextOfKin()
        {
            patientId = 4,
            fullName = "",
            cellPhone = "",
            email = "",
            residentialAddress = "res",
            relationship = "rel",
        };

        var res = await _nextOfKinService.Add(nextOfKin);
        Assert.Equal(res.data, 400);
    }

    #endregion

    #region Edit tests

    [Fact]
    public async Task EditNextOfKinValid()
    {
        var nextOfKin = new EditPatientNextOfKin()
        {
            id = 1,
            fullName = "Revaldo",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        };

        var res = await _nextOfKinService.Edit(nextOfKin);
        Assert.Equal(res.errorMessage, "");

        res = await _nextOfKinService.GetOne(1);
        var updatedNoK = (PatientNextOfKin)res.data;
        Assert.Equal(updatedNoK.FullName, "Revaldo");
    }

    [Fact]
    public async Task EditNextOfKinInvalid_NotFound()
    {
        var nextOfKin = new EditPatientNextOfKin()
        {
            id = 10000,
            fullName = "Revaldo",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        };

        var res = await _nextOfKinService.Edit(nextOfKin);
        Assert.Equal(res.data, 404);
    }

    #endregion

    #region Delete tests

    [Fact]
    public async Task DeleteNextOfKinValid()
    {
        var res = await _nextOfKinService.Delete(2);
        Assert.Equal(res.errorMessage, "");
    }

    [Fact]
    public async Task DeleteNextOfKinInvalid_NotFound()
    {
        var res = await _nextOfKinService.Delete(20000000);
        Assert.Equal(res.data, 404);
    }

    #endregion
}