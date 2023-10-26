using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;
using Moq;

namespace back_end_unit_tests;

public class FinancialProofOfDepositTests : BaseTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private FinancialStatementService financialStatementService;

    public FinancialProofOfDepositTests(ITestOutputHelper testOutputHelper)
    {
        this._testOutputHelper = testOutputHelper;
        var logger = Mock.Of<ILogger<FinancialStatementService>>();
        this.financialStatementService = new FinancialStatementService(this.dbContext, null, new FilesToDeleteService(this.dbContext), logger);
    }


    #region Get

    //----   GET PROOF OF DEPOSITS FOR PARENT VALID   ----
    [Fact]
    public async Task getProofOfDepositsForParentValid()
    {
        var response = await financialStatementService.GetProofOfDepositsForParent(5);
        Assert.Equal("", response.errorMessage);
    }

    //----   GET PENDING PROOF OF DEPOSITS   ----
    [Fact]
    public async Task getPendingProofOfDeposits()
    {
        var response = await financialStatementService.getPendingProofOfDeposits();
        Assert.Equal("", response.errorMessage);
    }


    #endregion

    #region Add

    //----   ADD PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task addProofOfDepositValid()
    {
        AddProofOfDeposit item = new AddProofOfDeposit()
        {
            parentId = 5,
            amount = 100,
            filePath = "a file path",
            fileName = "a name"
        };
        var response = await financialStatementService.AddProofOfDeposit(item);
        Assert.Equal("", response.errorMessage);
    }

    //----   ADD PROOF OF DEPOSIT INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task addProofOfDepositInvalid_ParentNotFound()
    {
        AddProofOfDeposit item = new AddProofOfDeposit()
        {
            parentId = 5000,
            amount = 100,
            filePath = "a file path",
            fileName = "a name"
        };
        var response = await financialStatementService.AddProofOfDeposit(item);
        Assert.Contains("not found", response.errorMessage.ToLower());
    }

    //----   ADD PROOF OF DEPOSIT INVALID, AMOUNT NOT GREATER THAN 0   ----
    [Fact]
    public async Task addProofOfDepositInvalid_AmountNotGreaterThan0()
    {
        AddProofOfDeposit item = new AddProofOfDeposit()
        {
            parentId = 5,
            amount = 0,
            filePath = "a file path",
            fileName = "a name"
        };
        var response = await financialStatementService.AddProofOfDeposit(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD PROOF OF DEPOSIT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task addProofOfDepositInvalid_EmptyValues()
    {
        AddProofOfDeposit item = new AddProofOfDeposit()
        {
            parentId = 5,
            amount = null,
            filePath = "",
            fileName = "a name"
        };
        var response = await financialStatementService.AddProofOfDeposit(item);
        Assert.NotEqual("", response.errorMessage);
    }

    #endregion

    #region Edit

    //----   EDIT PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task editProofOfDepositValid()
    {
        EditProofOfDeposit item = new EditProofOfDeposit()
        {
            id = 6,
            amount = 300,
            fileName = "dsjkf",
            filePath = "ndf"
        };
        var response = await financialStatementService.EditProofOfDeposit(item);
        Assert.Equal("", response.errorMessage);
    }

    //----   EDIT PROOF OF DEPOSIT INVALID, NOT FOUND   ----
    [Fact]
    public async Task editProofOfDepositInvalid_NotFound()
    {
        EditProofOfDeposit item = new EditProofOfDeposit()
        {
            id = 60000,
            amount = 300,
            fileName = "dsjkf",
            filePath = "ndf"
        };
        var response = await financialStatementService.EditProofOfDeposit(item);
        Assert.Equal(404, response.data);
    }

    //----   EDIT PROOF OF DEPOSIT INVALID, ALREADY APPROVED   ----
    [Fact]
    public async Task editProofOfDepositInvalid_AlreadyApproved()
    {
        EditProofOfDeposit item = new EditProofOfDeposit()
        {
            id = 3,
            amount = 300,
            fileName = "dsjkf",
            filePath = "ndf"
        };
        var response = await financialStatementService.EditProofOfDeposit(item);
        Assert.Equal(409, response.data);
    }

    //----   EDIT PROOF OF DEPOSIT STATUS INVALID, NOT FOUND   ----
    [Fact]
    public async Task editProofOfDepositStatusInvalid_NotFound()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 100000,
            status = 2,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "");
        Assert.Equal(404, response.data);
    }

    //----   EDIT PROOF OF DEPOSIT STATUS INVALID, INVALID STATUS   ----
    [Fact]
    public async Task editProofOfDepositStatusInvalid_InvalidStatus()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 1,
            status = 1,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "");
        Assert.Equal(400, response.data);
    }


    //----   APPROVE PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task approveProofOfDepositValid()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 1,
            status = 2,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "");
        Assert.Equal("", response.errorMessage);
    }

    //----   APPROVE PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY REJECTED   ----
    [Fact]
    public async Task approveProofOfDepositInvalid_DepositAlreadyRejected()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 2,
            status = 2,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "");
        Assert.Equal(409, response.data);
    }

    //----   APPROVE PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY APPROVED   ----
    [Fact]
    public async Task approveProofOfDepositInvalid_DepositAlreadyApproved()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 3,
            status = 2,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "");
        Assert.Equal(409, response.data);
    }

    //----   REJECT PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task rejectProofOfDepositValid()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 4,
            status = 3,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "a reason");
        Assert.Equal("", response.errorMessage);
    }

    //----   REJECT PROOF OF DEPOSIT INVALID, NO REASON PROVIDED   ----
    [Fact]
    public async Task rejectProofOfDepositInvalid_NoReasonProvided()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 2,
            status = 3,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "");
        Assert.Equal(400, response.data);
    }

    //----   REJECT PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY REJECTED   ----
    [Fact]
    public async Task rejectProofOfDepositInvalid_DepositAlreadyRejected()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 2,
            status = 3,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "a reason");
        Assert.Equal(409, response.data);
    }

    //----   REJECT PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY APPROVED   ----
    [Fact]
    public async Task rejectProofOfDepositInvalid_DepositAlreadyApproved()
    {
        EditProofOfDepositStatus item = new EditProofOfDepositStatus()
        {
            id = 3,
            status = 3,
        };
        var response = await financialStatementService.EditProofOfDepositStatus(item, "a reason");
        Assert.Equal(409, response.data);
    }

    #endregion

    #region Delete

    //----   DELETE PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task deleteProofOfDepositValid()
    {
        var response = await financialStatementService.DeleteProofOfDeposit(5);
        Assert.Equal("", response.errorMessage);
    }

    //----   DELETE PROOF OF DEPOSIT INVALID, NOT FOUND   ----
    [Fact]
    public async Task deleteProofOfDepositInvalid_NotFound()
    {
        var response = await financialStatementService.DeleteProofOfDeposit(5000);
        Assert.Equal(404, response.data);
    }

    #endregion
}