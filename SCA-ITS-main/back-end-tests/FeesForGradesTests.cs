
using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_2")]
public class FeesForGradesTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public FeesForGradesTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET ALL FEES FOR GRADES VALID   ----
    [Fact]
    public async Task getAllFeesForGradesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/finances/fees-for-grades/");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    #endregion

    #region Edit

    //----   EDIT FEE FOR GRADE VALID   ----
    [Fact]
    public async Task editFeeForGradeValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditFeeForGrade()
        {
            grade = 1,
            amount = 300,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/fees-for-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT FEE FOR GRADE INVALID, NOT FOUND   ----
    [Fact]
    public async Task editFeeForGradeInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditFeeForGrade()
        {
            grade = 100000,
            amount = 300,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/fees-for-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT FEE FOR GRADE INVALID, AMOUNT LESS THAN 0   ----
    [Fact]
    public async Task editFeeForGradeInvalid_AmountLessThan0()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditFeeForGrade()
        {
            grade = 1,
            amount = -300,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/fees-for-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT FEE FOR GRADE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task editFeeForGradeInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditFeeForGrade()
        {
            grade = null,
            amount = null,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/fees-for-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT FEE FOR GRADE INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task editFeeForGradeInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditFeeForGrade()
        {
            grade = null,
            amount = null,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/finances/fees-for-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

}