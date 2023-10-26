using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.Models;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

namespace back_end_unit_tests;

public class FeesForGradesTests : BaseTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private FeesForGradesService feesForGradesService;

    public FeesForGradesTests(ITestOutputHelper testOutputHelper)
    {
        this._testOutputHelper = testOutputHelper;
        this.feesForGradesService = new FeesForGradesService(this.dbContext, null);
    }


    #region Get

    //----   GET ALL FEES FOR GRADES VALID   ----
    [Fact]
    public async Task getAllFeesForGradesValid()
    {
        var response = await feesForGradesService.GetAll();
        Assert.Equal("", response.errorMessage);
    }

    #endregion

    #region Edit

    //----   EDIT FEE FOR GRADE VALID   ----
    [Fact]
    public async Task editFeeForGradeValid()
    {
        EditFeeForGrade item = new EditFeeForGrade()
        {
            grade = 1,
            amount = 300,
        };
        var response = await feesForGradesService.Edit(item);
        Assert.Equal("", response.errorMessage);
    }

    //----   EDIT FEE FOR GRADE INVALID, NOT FOUND   ----
    [Fact]
    public async Task editFeeForGradeInvalid_NotFound()
    {
        EditFeeForGrade item = new EditFeeForGrade()
        {
            grade = 100000,
            amount = 300,
        };
        var response = await feesForGradesService.Edit(item);
        Assert.Equal(404, response.data);
    }

    //----   EDIT FEE FOR GRADE INVALID, AMOUNT LESS THAN 0   ----
    [Fact]
    public async Task editFeeForGradeInvalid_AmountLessThan0()
    {
        EditFeeForGrade item = new EditFeeForGrade()
        {
            grade = 1,
            amount = -300,
        };
        var response = await feesForGradesService.Edit(item);
        Assert.Equal(400, response.data);
    }

    //----   EDIT FEE FOR GRADE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task editFeeForGradeInvalid_EmptyValues()
    {
        EditFeeForGrade item = new EditFeeForGrade()
        {
            grade = null,
            amount = null,
        };
        var response = await feesForGradesService.Edit(item);
        Assert.Equal(400, response.data);
    }

    #endregion
}