
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

namespace back_end_tests;

[Collection("GROUP_1")]
public class ProgressReportTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public ProgressReportTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    #region Template tests

    //----   GET ALL PROGRESS REPORT TEMPLATES VALID   ----
    [Fact]
    public async Task GetProgressReportTemplatesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/progress-reports/all");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL PROGRESS REPORT TEMPLATES INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetProgressReportTemplatesInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/progress-reports/all");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   ADD PROGRESS REPORT VALID   ----
    [Fact]
    public async Task AddProgressReportValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReport()
        {
            name = "Math 4 template",
            examMarksAvailable = 100,
            examWeight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }


    //----   ADD PROGRESS REPORT INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task AddProgressReportInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReport()
        {
            name = "Math 4 template",
            examMarksAvailable = 100,
            examWeight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD PROGRESS REPORT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task AddProgressReportInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReport()
        {
            name = "",
            examMarksAvailable = 100,
            examWeight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD PROGRESS REPORT INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task AddProgressReportInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReport()
        {
            name = "Math 7 template",
            examMarksAvailable = 100,
            examWeight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD PROGRESS REPORT INVALID, EXAM WEIGHT OUT OF RANGE   ----
    [Fact]
    public async Task AddProgressReportInvalid_ExamWeightOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReport()
        {
            name = "Math 8 template",
            examMarksAvailable = 100,
            examWeight = 800
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   DELETE PROGRESS REPORT VALID   ----
    [Fact]
    public async Task DeleteProgressReportValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/progress-reports/3");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE PROGRESS REPORT INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteProgressReportInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/progress-reports/100000");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PROGRESS REPORT VALID   ----
    [Fact]
    public async Task EditProgressReportValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProgressReport()
        {
            id = 4,
            name = "Math 76 template",
            examMarksAvailable = 80,
            examWeight = 50
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }


    //----   EDIT PROGRESS REPORT INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task EditProgressReportInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditProgressReport()
        {
            id = 4,
            name = "Math 4 template",
            examMarksAvailable = 50,
            examWeight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   EDIT PROGRESS REPORT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task EditProgressReportInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProgressReport()
        {
            id = 4,
            name = "",
            examMarksAvailable = 100,
            examWeight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT PROGRESS REPORT INVALID, NOT FOUND   ----
    [Fact]
    public async Task EditProgressReportInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProgressReport()
        {
            id = 4000000,
            name = "Mathhhhhhhhhhhh 7 template",
            examMarksAvailable = 90,
            examWeight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PROGRESS REPORT INVALID, EXAM WEIGHT OUT OF RANGE   ----
    [Fact]
    public async Task EditProgressReportInvalid_ExamWeightOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditProgressReport()
        {
            id = 4,
            name = "Mathhhh 4 template",
            examMarksAvailable = 100,
            examWeight = 8000
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

    #region Category tests

    //----   GET PROGRESS REPORT CATEGORIES VALID   ----
    [Fact]
    public async Task GetProgressReportCategoriesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/progress-reports/categories/all/1");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PROGRESS REPORT CATEGORIES INVALID, NO TOKEN   ----   ----
    [Fact]
    public async Task GetProgressReportCategoriesInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/progress-reports/categories/all/1");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }


    //----   ADD PROGRESS REPORT CATEGORY VALID   ----
    [Fact]
    public async Task AddProgressReportCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReportCategory()
        {
            progressReportId = 1,
            name = "Math 4 template",
            weight = 19
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }


    //----   ADD PROGRESS REPORT CATEGORY INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task AddProgressReportCategoryInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReportCategory()
        {
            progressReportId = 1,
            name = "Math 43 template",
            weight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD PROGRESS REPORT CATEGORY INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task AddProgressReportCategoryInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReportCategory()
        {
            progressReportId = null,
            name = "",
            weight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD PROGRESS REPORT CATEGORY INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task AddProgressReportCategoryInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReportCategory()
        {
            progressReportId = 1,
            name = "aNewOneIThink",
            weight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD PROGRESS REPORT CATEGORY INVALID, WEIGHT OF ALL CATEGORIES OUT OF RANGE   ----
    [Fact]
    public async Task AddProgressReportCategoryInvalid_WeightOfAllCategoriesOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReportCategory()
        {
            progressReportId = 1,
            name = "jkdsnf",
            weight = 80
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD PROGRESS REPORT CATEGORY INVALID, EXAM WEIGHT OUT OF RANGE   ----
    [Fact]
    public async Task AddProgressReportCategoryInvalid_ExamWeightOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddProgressReportCategory()
        {
            progressReportId = 1,
            name = "Math 7 template",
            weight = 800
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   DELETE PROGRESS REPORT CATEGORY VALID   ----
    [Fact]
    public async Task DeleteProgressReportCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/progress-reports/categories/1");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE PROGRESS REPORT CATEGORY INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteProgressReportCategoryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/progress-reports/categories/100");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PROGRESS REPORT CATEGORY VALID   ----
    [Fact]
    public async Task EditProgressReportCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditCategory()
        {
            id = 3,
            name = "temp1",
            weight = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }


    //----   EDIT PROGRESS REPORT CATEGORY INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task EditProgressReportCategoryInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditCategory()
        {
            id = 3,
            name = "temp1",
            weight = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   EDIT PROGRESS REPORT CATEGORY INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task EditProgressReportCategoryInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditCategory()
        {
            id = 3,
            name = "",
            weight = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT PROGRESS REPORT CATEGORY INVALID, NOT FOUND   ----
    [Fact]
    public async Task EditProgressReportCategoryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditCategory()
        {
            id = 30000,
            name = "kjsdfn",
            weight = 30
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PROGRESS REPORT CATEGORY INVALID, TOTAL WEIGHT OUT OF RANGE   ----
    [Fact]
    public async Task EditProgressReportCategoryInvalid_TotalWeightOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditCategory()
        {
            id = 3,
            name = "tempp",
            weight = 60
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    #endregion

    #region Assessment tests

    //----   GET CATEGORY ASSESSMENTS VALID   ----
    [Fact]
    public async Task GetCategoryAssesssmentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/progress-reports/categories/assessments/all/2");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET CATEGORY ASSESSMENTS INVALID, NO TOKEN   ----   ----
    [Fact]
    public async Task GetCategoryAssesssmentsInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/progress-reports/categories/assessments/all/2");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }


    //----   ADD PROGRESS REPORT ASSESSMENT VALID   ----
    [Fact]
    public async Task AddCategoryAssesssmentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCategoryAssessment()
        {
            categoryId = 2,
            name = "la dee da",
            marksAvailable = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }


    //----   ADD PROGRESS REPORT ASSESSMENT INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task AddCategoryAssesssmentInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddCategoryAssessment()
        {
            categoryId = 2,
            name = "la dee da?",
            marksAvailable = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD PROGRESS REPORT ASSESSMENT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task AddCategoryAssesssmentInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCategoryAssessment()
        {
            categoryId = null,
            name = "",
            marksAvailable = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD PROGRESS REPORT ASSESSMENT INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task AddCategoryAssesssmentInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCategoryAssessment()
        {
            categoryId = 2,
            name = "exists",
            marksAvailable = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD PROGRESS REPORT ASSESSMENT INVALID, CATEGORY NOT FOUND   ----
    [Fact]
    public async Task AddCategoryAssesssmentInvalid_CategoryNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCategoryAssessment()
        {
            categoryId = 100,
            name = "exists",
            marksAvailable = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE CATEGORY ASSESSMENTS VALID   ----
    [Fact]
    public async Task DeleteCategoryAssesssmentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/progress-reports/categories/assessments/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE CATEGORY ASSESSMENTS INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteCategoryAssesssmentsInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/progress-reports/categories/assessments/100");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT ASSESSMENT VALID   ----
    [Fact]
    public async Task EditAssessmentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditAssessment()
        {
            id = 4,
            name = "exists444",
            marksAvailable = 100
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT ASSESSMENT INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task EditAssessmentInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditAssessment()
        {
            id = 4,
            name = "exists1",
            marksAvailable = 100
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   EDIT ASSESSMENT INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task EditAssessmentInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditAssessment()
        {
            id = 4,
            name = "exists444",
            marksAvailable = 100
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   EDIT ASSESSMENT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task EditAssessmentInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditAssessment()
        {
            id = null,
            name = "",
            marksAvailable = 100
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT ASSESSMENT INVALID, MARKS OUT OF RANGE   ----
    [Fact]
    public async Task EditAssessmentInvalid_MarksOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditAssessment()
        {
            id = 4,
            name = "exists3444",
            marksAvailable = -2
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT ASSESSMENT INVALID, NOT FOUND   ----
    [Fact]
    public async Task EditAssessmentInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditAssessment()
        {
            id = 40000,
            name = "exists444",
            marksAvailable = 100
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/progress-reports/categories/assessments/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion

    #region Course progress report tests

    //----   GET ALL COURSE PROGRESS REPORTS VALID   ----
    [Fact]
    public async Task GetAllCourseProgressReportsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/courses/progress-reports/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL COURSE PROGRESS REPORTS INVALID, NOT AN ADMIN OR STAFF TOKEN   ----
    [Fact]
    public async Task GetAllCourseProgressReportsInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/courses/progress-reports/MATH4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD COURSE PROGRESS REPORT VALID   ----
    [Fact]
    public async Task Post_AddCourseProgressReportValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseProgressReport()
        {
            courseId = "MATH4",
            progressReportId = 1,
            numberOfTerms = 4,
            year = 2022
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/progress-reports", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD COURSE PROGRESS REPORTS INVALID, COURSE NOT FOUND   ----
    [Fact]
    public async Task Post_AddCourseProgressReportInvalid_CourseNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseProgressReport()
        {
            courseId = "MATH43333333",
            progressReportId = 1,
            numberOfTerms = 4,
            year = 2022
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/progress-reports", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD COURSE PROGRESS REPORTS INVALID, PROGRESS REPORT NOT FOUND   ----
    [Fact]
    public async Task Post_AddCourseProgressReportInvalid_ProgressReportsNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseProgressReport()
        {
            courseId = "MATH4",
            progressReportId = 1111111,
            numberOfTerms = 4,
            year = 2022
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/progress-reports", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD COURSE PROGRESS REPORTS INVALID, THERE IS ALREADY A PROGRESS REPORT FOR YEAR   ----
    [Fact]
    public async Task Post_AddCourseProgressReportInvalid_ThereIsAlreadyAProgressReportForYear()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddCourseProgressReport()
        {
            courseId = "MATH7",
            progressReportId = 2,
            numberOfTerms = 4,
            year = 2022
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/courses/progress-reports", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   DELETE COURSE PROGRESS REPORT VALID   ----
    [Fact]
    public async Task Post_DeleteCourseProgressReportValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/courses/progress-reports/delete/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE COURSE PROGRESS REPORT INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_DeleteCourseProgressReportInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/courses/progress-reports/delete/100000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion

    #region Student progress report tests

    //----   GET STUDENT PROGRESS REPORTS VALID   ----
    [Fact]
    public async Task GetStudentProgressReportsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/student/progress-reports/220038627");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET STUDENT ASSESSMENTS INVALID, NO TOKEN   ----   ----
    [Fact]
    public async Task GetStudentProgressReportsInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/student/progress-reports/220038627");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   GET STUDENT PROGRESS REPORT ASSESSMENTS BY CATEGORY VALID   ----
    [Fact]
    public async Task GetStudentProgressReportsAssessmentsByCategoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/student/progress-reports/assessments?courseReportId=1&studentNumber=220038627&categoryId=1");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE STUDENT ASSESSMENT MARK VALID   ----
    [Fact]
    public async Task UpdateStudentAssessmentMarkValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentAssessmentMark()
        {
            reportAssessmentId = 2,
            studentAssessmentId = 1,
            mark = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/assessments/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE STUDENT ASSESSMENT MARK INVALID, REPORT ASSESSMENT NOT FOUND   ----
    [Fact]
    public async Task UpdateStudentAssessmentMarkInvalid_ReportAssessmentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentAssessmentMark()
        {
            reportAssessmentId = 20,
            studentAssessmentId = 1,
            mark = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/assessments/update", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE STUDENT ASSESSMENT MARK INVALID, STUDENT ASSESSMENT NOT FOUND   ----
    [Fact]
    public async Task UpdateStudentAssessmentMarkInvalid_StudentAssessmentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentAssessmentMark()
        {
            reportAssessmentId = 2,
            studentAssessmentId = 100000,
            mark = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/assessments/update", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }


    //----   UPDATE STUDENT ASSESSMENT MARK INVALID, MARK OUT OF RANGE   ----
    [Fact]
    public async Task UpdateStudentAssessmentMarkInvalid_MarkOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentAssessmentMark()
        {
            reportAssessmentId = 2,
            studentAssessmentId = 1,
            mark = 21,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/assessments/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   UPDATE STUDENT ASSESSMENT MARK INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task UpdateStudentAssessmentMarkInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentAssessmentMark()
        {
            reportAssessmentId = null,
            studentAssessmentId = null,
            mark = 21,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/assessments/update", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }


    //----   UPDATE STUDENT EXAM MARK VALID   ----
    [Fact]
    public async Task UpdateStudentExamMarkValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentExamMark()
        {
            id = 1,
            mark = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/exam/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE STUDENT EXAM MARK INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task UpdateStudentExamMarkInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentExamMark()
        {
            id = 1000,
            mark = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/exam/update", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE STUDENT EXAM MARK INVALID, MARK OUT OF RANGE   ----
    [Fact]
    public async Task UpdateStudentExamMarkInvalid_MarkOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentExamMark()
        {
            id = 1,
            mark = 1000
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/exam/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   UPDATE STUDENT EXAM MARK INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task UpdateStudentExamMarkInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateStudentExamMark()
        {
            id = null,
            mark = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/progress-reports/exam/update", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

}