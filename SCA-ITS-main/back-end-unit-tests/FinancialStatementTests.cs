using SCA_ITS_back_end.Services;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;
using Moq;

namespace back_end_unit_tests;

public class FinancialStatementTests : BaseTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private FinancialStatementService financialStatementService;

    public FinancialStatementTests(ITestOutputHelper testOutputHelper)
    {
        this._testOutputHelper = testOutputHelper;
        var logger = Mock.Of<ILogger<FinancialStatementService>>();
        this.financialStatementService = new FinancialStatementService(this.dbContext, null, new FilesToDeleteService(this.dbContext), logger);
    }

    #region Get tests

    //----   GET PARENT STATEMENT VALID   ----
    [Fact]
    public async Task getParentStatementValid()
    {
        var response = await financialStatementService.GetStatementForParent(5);
        Assert.Equal("", response.errorMessage);
    }

    //----   GET PARENT STATEMENT INVALID, NOT FOUND   ----
    [Fact]
    public async Task getParentStatementInvalid_NotFound()
    {
        var response = await financialStatementService.GetStatementForParent(5000);
        Assert.Contains("not found", response.errorMessage.ToLower());
    }

    //----   GET STATEMENT ITEMS VALID   ----
    [Fact]
    public async Task getStatementItemsValid()
    {
        var response = await financialStatementService.GetStatementItemsForParent(5);
        Assert.Equal("", response.errorMessage);
    }

    #endregion

    #region Add tests

    //----   ADD PARENT FINANCIAL STATEMENT VALID   ----
    [Fact]
    public async Task addParentFinancialStatementValid()
    {
        var response = await financialStatementService.AddStatementForParent(2);
        Assert.Equal("", response.errorMessage);
    }

    //----   ADD PARENT FINANCIAL STATEMENT INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task addParentFinancialStatementInvalid_AlreadyExists()
    {
        var response = await financialStatementService.AddStatementForParent(5);
        Assert.Contains("exist", response.errorMessage.ToLower());
    }

    //----   ADD PARENT FINANCIAL STATEMENT INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task addParentFinancialStatementInvalid_ParentNotFound()
    {
        var response = await financialStatementService.AddStatementForParent(5000);
        Assert.Contains("not found", response.errorMessage.ToLower());
    }

    //----   ADD STATEMENT ITEM VALID   ----
    [Fact]
    public async Task addStatementItemValid()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DEPOSIT,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.Contains("", response.errorMessage.ToLower());
    }

    //----   ADD STATEMENT ITEM INVALID, DEPOSIT DEBIT AMOUNT GREATER THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DepositDebitAmountGreaterThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DEPOSIT,
            creditAmount = 100,
            debitAmount = 200,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, DEPOSIT CREDIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DepositCreditAmountNotMoreThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DEPOSIT,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, FEE DEBIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_FeeDebitAmountNotMoreThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.FEE,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, FEE CREDIT AMOUNT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_FeeCreditAmountMoreThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.FEE,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, DISCOUNT CREDIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DiscountCreditAmountNotMoreThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DISCOUNT,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, DISCOUNT DEBIT AMOUNT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DiscountDebitAmountMoreThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DISCOUNT,
            creditAmount = 100,
            debitAmount = 200,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, REFUND CREDIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_RefundCreditAmountNotMoreThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.REFUND,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, REFUND DEBIT AMOUNT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_RefundDebitAmountMoreThan0()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.REFUND,
            creditAmount = 100,
            debitAmount = 200,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, STATEMENT NOT FOUND   ----
    [Fact]
    public async Task addStatementItemInvalid_StatementNotFound()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5000,
            itemType = (int)Statement_Item_Type.REFUND,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, WRONG TYPE   ----
    [Fact]
    public async Task addStatementItemInvalid_WrongType()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = 1000,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    //----   ADD STATEMENT ITEM INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task addStatementItemInvalid_EmptyValues()
    {
        AddStatementItem item = new AddStatementItem()
        {
            parentId = 5,
            itemType = null,
            creditAmount = null,
            debitAmount = 0,
            description = ""
        };
        var response = await financialStatementService.AddStatementItem(item);
        Assert.NotEqual("", response.errorMessage);
    }

    #endregion

    #region Charge fees tests

    //----   CHARGE ALL PARENTS MONTHLY FEES VALID   ----
    [Fact]
    public async Task chargeAllParentsMonthlyFeesValid()
    {
        var response = await financialStatementService.ChargeAllParentsMonthlyFees();
        Assert.Equal("", response.errorMessage);

        response = await financialStatementService.GetStatementItemsForParent(5);

        List<StatementItemGet> data = (List<StatementItemGet>)response.data;
        Assert.True(data.Count > 0);

        Assert.Contains("FEE-5", data[0].Reference);
    }

    #endregion
}