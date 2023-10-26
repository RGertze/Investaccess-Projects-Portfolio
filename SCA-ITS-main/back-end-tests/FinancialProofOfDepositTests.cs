using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_1")]
public class FinancialProofOfDepositTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public FinancialProofOfDepositTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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


    #region Get

    //----   GET PROOF OF DEPOSITS FOR PARENT VALID   ----
    [Fact]
    public async Task getProofOfDepositsForParentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/finances/proof-of-deposit/5");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PENDING PROOF OF DEPOSITS VALID   ----
    [Fact]
    public async Task getPendingProofOfDepositsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/finances/proof-of-deposit/pending");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    #endregion

    #region Add

    //----   ADD PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task addProofOfDepositValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddProofOfDeposit()
        {
            parentId = 5,
            amount = 100,
            filePath = "a file path",
            fileName = "a name"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD PROOF OF DEPOSIT INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task addProofOfDepositInvalid_ParentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddProofOfDeposit()
        {
            parentId = 5000,
            amount = 100,
            filePath = "a file path",
            fileName = "a name"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD PROOF OF DEPOSIT INVALID, AMOUNT NOT GREATER THAN 0   ----
    [Fact]
    public async Task addProofOfDepositInvalid_AmountNotGreaterThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddProofOfDeposit()
        {
            parentId = 5,
            amount = 0,
            filePath = "a file path",
            fileName = "a name"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD PROOF OF DEPOSIT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task addProofOfDepositInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddProofOfDeposit()
        {
            parentId = 5,
            amount = null,
            filePath = "",
            fileName = "a name"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

    #region Edit

    //----   EDIT PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task editProofOfDepositValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDeposit()
        {
            id = 6,
            amount = 300,
            fileName = "dsjkf",
            filePath = "ndf"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT PROOF OF DEPOSIT INVALID, NOT FOUND   ----
    [Fact]
    public async Task editProofOfDepositInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDeposit()
        {
            id = 60000,
            amount = 300,
            fileName = "dsjkf",
            filePath = "ndf"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PROOF OF DEPOSIT INVALID, ALREADY APPROVED   ----
    [Fact]
    public async Task editProofOfDepositInvalid_AlreadyApproved()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDeposit()
        {
            id = 3,
            amount = 300,
            fileName = "dsjkf",
            filePath = "ndf"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }


    //----   EDIT PROOF OF DEPOSIT STATUS INVALID, NOT FOUND   ----
    [Fact]
    public async Task editProofOfDepositStatusInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 100000,
            status = 2,
            message = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PROOF OF DEPOSIT STATUS INVALID, INVALID STATUS   ----
    [Fact]
    public async Task editProofOfDepositStatusInvalid_InvalidStatus()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 1,
            status = 1,
            message = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   APPROVE PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task approveProofOfDepositValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 1,
            status = 2,
            message = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   APPROVE PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY REJECTED   ----
    [Fact]
    public async Task approveProofOfDepositInvalid_DepositAlreadyRejected()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 2,
            status = 2,
            message = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   APPROVE PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY APPROVED   ----
    [Fact]
    public async Task approveProofOfDepositInvalid_DepositAlreadyApproved()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 3,
            status = 2,
            message = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   REJECT PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task rejectProofOfDepositValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 4,
            status = 3,
            message = "idk man"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REJECT PROOF OF DEPOSIT INVALID, NO REASON PROVIDED   ----
    [Fact]
    public async Task rejectProofOfDepositInvalid_NoReasonProvided()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 2,
            status = 3,
            message = "for some reason"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   REJECT PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY REJECTED   ----
    [Fact]
    public async Task rejectProofOfDepositInvalid_DepositAlreadyRejected()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 2,
            status = 3,
            message = "just no"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   REJECT PROOF OF DEPOSIT INVALID, DEPOSIT ALREADY APPROVED   ----
    [Fact]
    public async Task rejectProofOfDepositInvalid_DepositAlreadyApproved()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProofOfDepositStatusRequest()
        {
            id = 3,
            status = 3,
            message = "why even try"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/proof-of-deposit/status/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    #endregion

    #region Delete

    //----   DELETE PROOF OF DEPOSIT VALID   ----
    [Fact]
    public async Task deleteProofOfDepositValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.DeleteAsync("api/finances/proof-of-deposit/5");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE PROOF OF DEPOSIT INVALID, NOT FOUND   ----
    [Fact]
    public async Task deleteProofOfDepositInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.DeleteAsync("api/finances/proof-of-deposit/5");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion
}