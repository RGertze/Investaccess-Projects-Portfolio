
using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_1")]
public class FinancialStatementTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public FinancialStatementTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);
        _testOutputHelper = testOutputHelper;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(4, 1);
        parentToken = jwtHandler.generate(2, 2);
        staffToken = jwtHandler.generate(3, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    //----   CHARGE MONTHLY FEES VALID   ----
    [Fact]
    public async Task chargeMonthlyFeesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ChargeParentsMonthlyFeesRequest()
        {
            token = config["AWS_LAMBDA:Token"]
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/charge-monthly-fees", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   CHARGE MONTHLY FEES INVALID, INCORRECT TOKEN   ----
    [Fact]
    public async Task chargeMonthlyFeesInvalid_IncorrectToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ChargeParentsMonthlyFeesRequest()
        {
            token = "fflkdskd"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/charge-monthly-fees", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   CHARGE MONTHLY FEES INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task chargeMonthlyFeesInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ChargeParentsMonthlyFeesRequest()
        {
            token = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/charge-monthly-fees", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM VALID   ----
    [Fact]
    public async Task addStatementItemValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DEPOSIT,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD STATEMENT ITEM INVALID, DEPOSIT DEBIT AMOUNT GREATER THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DepositDebitAmountGreaterThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DEPOSIT,
            creditAmount = 100,
            debitAmount = 200,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, DEPOSIT CREDIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DepositCreditAmountNotMoreThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DEPOSIT,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, FEE DEBIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_FeeDebitAmountNotMoreThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.FEE,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, FEE CREDIT AMOUNT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_FeeCreditAmountMoreThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.FEE,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, DISCOUNT CREDIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DiscountCreditAmountNotMoreThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DISCOUNT,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, DISCOUNT DEBIT AMOUNT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_DiscountDebitAmountMoreThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.DISCOUNT,
            creditAmount = 100,
            debitAmount = 200,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, REFUND CREDIT AMOUNT NOT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_RefundCreditAmountNotMoreThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.REFUND,
            creditAmount = 0,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, REFUND DEBIT AMOUNT MORE THAN 0   ----
    [Fact]
    public async Task addStatementItemInvalid_RefundDebitAmountMoreThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = (int)Statement_Item_Type.REFUND,
            creditAmount = 100,
            debitAmount = 200,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, STATEMENT NOT FOUND   ----
    [Fact]
    public async Task addStatementItemInvalid_StatementNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5000,
            itemType = (int)Statement_Item_Type.REFUND,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD STATEMENT ITEM INVALID, WRONG TYPE   ----
    [Fact]
    public async Task addStatementItemInvalid_WrongType()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = 1000,
            creditAmount = 100,
            debitAmount = 0,
            description = "description"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STATEMENT ITEM INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task addStatementItemInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStatementItem()
        {
            parentId = 5,
            itemType = null,
            creditAmount = null,
            debitAmount = 0,
            description = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/statements/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }
}