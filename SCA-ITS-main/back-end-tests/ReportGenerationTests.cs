
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using SCA_ITS_back_end.DB_Models;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Services;
using Microsoft.Extensions.DependencyInjection;

namespace back_end_tests;

[Collection("GROUP_2")]
public class ReportGenerationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    private StudentReportService studentReportService;

    public ReportGenerationTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

        var scope = factory.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
        this.studentReportService = scope.ServiceProvider.GetRequiredService<StudentReportService>();
    }


    //----   ADD REPORT GENERATION JOB VALID   ----
    [Fact]
    public async Task AddReportGenerationJobValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddGenerationJob()
        {
            reportGroupId = 6,
            term = 4,
            schoolReOpens = "10/23/2022"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/generate/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD REPORT GENERATION JOB INVALID, REPORT GROUP DOES NOT EXIST   ----
    [Fact]
    public async Task AddReportGenerationJobInvalid_ReportGroupDoesNotExist()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddGenerationJob()
        {
            reportGroupId = 60000000,
            term = 4,
            schoolReOpens = "10/23/2022"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/generate/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD REPORT GENERATION JOB INVALID, TERM OUT OF RANGE   ----
    [Fact]
    public async Task AddReportGenerationJobInvalid_TermOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddGenerationJob()
        {
            reportGroupId = 6,
            term = 77,
            schoolReOpens = "10/23/2022"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/generate/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD REPORT GENERATION JOB INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task AddReportGenerationJobInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddGenerationJob()
        {
            reportGroupId = null,
            term = null,
            schoolReOpens = "10/23/2022"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/generate/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD REPORT GENERATION JOB INVALID   ----
    [Fact]
    public async Task AddReportGenerationJobInvalid_JobForThatTermAlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddGenerationJob()
        {
            reportGroupId = 6,
            term = 1,
            schoolReOpens = "10/23/2022"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/generate/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   DELETE REPORT GENERATION JOB VALID   ----
    [Fact]
    public async Task DeleteReportGenerationJobValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/reports/generate/2");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE REPORT GENERATION JOB INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteReportGenerationJobInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/reports/generate/20000");

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }
}