
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

[Collection("GROUP_3")]
public class ReportTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    private StudentReportService studentReportService;

    public ReportTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    #region Report group tests

    //----   GET ALL REPORT GROUPS VALID   ----
    [Fact]
    public async Task GetReportGroupsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/reports/groups");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL REPORT GROUPS, NO TOKEN   ----
    [Fact]
    public async Task GetReportGroupsInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/reports/groups");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   ADD REPORT GROUP VALID   ----
    [Fact]
    public async Task AddReportGroupValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddReportGroup()
        {
            year = 2023,
            terms = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/groups/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD REPORT GROUP INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task AddReportGroupInValid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddReportGroup()
        {
            year = null,
            terms = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/groups/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD REPORT GROUP INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task AddReportGroupInValid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddReportGroup()
        {
            year = 2024,
            terms = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/groups/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD REPORT GROUP INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task AddReportGroupInValid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddReportGroup()
        {
            year = 2022,
            terms = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/groups/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   DELETE REPORT GROUP VALID   ----
    [Fact]
    public async Task DeleteReportGroupValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/reports/groups/1");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE REPORT GROUP INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteReportGroupInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/reports/groups/1000000");

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion

    #region Report Service tests

    //----   ADD REPORTS FOR ALL PRIMARY STUDENTS VALID   ----
    [Fact]
    public async Task AddReportsForAllPrimaryStudentsValid()
    {
        var result = await studentReportService.AddReportsForAllPrimaryStudents(3, 4);
        _testOutputHelper.WriteLine(result.errorMessage.ToString());

        Assert.True(result.errorMessage.Length == 0);
    }

    #endregion

    #region Report tests

    //----   GET REPORTS BY GRADE VALID   ----
    [Fact]
    public async Task GetReportsByGradeValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/reports/4?grade=3");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET REPORTS BY GRADE INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetReportsByGradeInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/reports/4?grade=3");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    #endregion

    #region Report details

    //----   EDIT PRE PRIMARY REPORT DETAILS VALID   ----
    [Fact]
    public async Task EditPreReportDetailsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportDetails()
        {
            id = 6,
            daysAbsent = 10,
            dominantHand = 1,
            personaBriefComments = "ksdjnfsdf",
            registerTeacher = "skjdfn"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/details/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT PRIMARY REPORT DETAILS VALID   ----
    [Fact]
    public async Task EditPrimaryReportDetailsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportDetails()
        {
            id = 1,
            daysAbsent = 10,
            dominantHand = 1,
            personaBriefComments = "ksdjnfsdf",
            registerTeacher = "skjdfn"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/details/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    #endregion

    #region Course Remark tests

    //----   GET ALL COURSE REMARKS FOR STUDENT VALID   ----
    [Fact]
    public async Task GetAllCourseRemarksForStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/reports/course-remarks/3");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL COURSE REMARKS FOR STUDENT INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllCourseRemarksForStudentInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/reports/course-remarks/3");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   EDIT COURSE REMARK VALID   ----
    [Fact]
    public async Task EditCourseRemarkValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditCourseRemark()
        {
            id = 1,
            remark = "well done",
            initials = "ML"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/course-remarks/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT COURSE REMARK INVALID, NOT FOUND   ----
    [Fact]
    public async Task EditCourseRemarkInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditCourseRemark()
        {
            id = 10000001,
            remark = "well done",
            initials = "ML"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/course-remarks/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT COURSE REMARK INVALID, ID IS NULL   ----
    [Fact]
    public async Task EditCourseRemarkInvalid_IdIsNull()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditCourseRemark()
        {
            id = null,
            remark = "",
            initials = "ML"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/course-remarks/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

    #region Person tests

    //----   GET ALL PERSONA CATEGORIES VALID   ----
    [Fact]
    public async Task GetAllPersonaCategoriesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/reports/persona-categories");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL PERSONA CATEGORIES INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllPersonaCategoriesInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/reports/persona-categories");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    #endregion

    #region Persona grade tests

    //----   GET ALL PERSONA GRADES FOR STUDENT VALID   ----
    [Fact]
    public async Task GetAllPersonaGradesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/reports/persona-grades/3");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL PERSONA GRADES FOR STUDENT INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllPersonaGradesInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/reports/persona-grades/3");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    // E – excellent; G – good; S – satisfactory; N – needs Improvement

    //----   EDIT PERSONA GRADE VALID   ----
    [Fact]
    public async Task EditPersonaGradeValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = 1,
            grade = "E"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/persona-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT PERSONA GRADE INVALID, GRADE OUT OF RANGE   ----
    [Fact]
    public async Task EditPersonaGradeInvalid_GradeOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = 1,
            grade = "A"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/persona-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT PERSONA GRADE INVALID, NOT FOUND   ----
    [Fact]
    public async Task EditPersonaGradeInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = 10000001,
            grade = "E"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/persona-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PERSONA GRADE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task EditPersonaGradeInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = null,
            grade = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/reports/persona-grades/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

    #region Report file retrieval

    //----   GET ALL GENERATED REPORTS FOR STUDENT VALID   ----
    [Fact]
    public async Task GetAllGeneratedReportsForStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/reports/students/220038627/generated");

        Assert.True(response.IsSuccessStatusCode);
    }

    #endregion

    #region Development Assessment tests

    //----   GET ALL DEVELOPMENT GROUPS VALID   ----
    [Fact]
    public async Task GetAllDevelopmentGroupsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-groups");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL DEVELOPMENT GROUPS INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllDevelopmentGroupsInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-groups");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   GET ALL DEVELOPMENT CATEGORIES VALID   ----
    [Fact]
    public async Task GetAllDevelopmentCategoriesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-categories");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL DEVELOPMENT CATEGORIES INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllDevelopmentCategoriesInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-categories");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   GET ALL DEVELOPMENT ASSESSMENTS VALID   ----
    [Fact]
    public async Task GetAllDevelopmentAssessmentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-assessments");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL DEVELOPMENT ASSESSMENTS INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllDevelopmentAssessmentsInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-assessments");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   GET ALL DEVELOPMENT ASSESSMENT GRADES VALID   ----
    [Fact]
    public async Task GetAllDevelopmentAssessmentGradesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-assessment-grades/1234");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL DEVELOPMENT ASSESSMENT GRADES INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllDevelopmentAssessmentGradesInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/pre-primary-progress-reports/development-assessment-grades/1234");

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   EDIT DEVELOPMENT ASSESSMENT GRADE VALID   ----
    [Fact]
    public async Task EditDevelopmentAssessmentGradeValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = 1,
            grade = "2"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/pre-primary-progress-reports/grade/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT DEVELOPMENT ASSESSMENT GRADE INVALID, GRADE OUT OF RANGE   ----
    [Fact]
    public async Task EditDevelopmentAssessmentGradeInvalid_GradeOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = 1,
            grade = "200"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/pre-primary-progress-reports/grade/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT DEVELOPMENT ASSESSMENT GRADE INVALID, NOT FOUND   ----
    [Fact]
    public async Task EditDevelopmentAssessmentGradeInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = 10000001,
            grade = "2"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/pre-primary-progress-reports/grade/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT DEVELOPMENT ASSESSMENT GRADE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task EditDevelopmentAssessmentGradeInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditReportGrade()
        {
            id = null,
            grade = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/pre-primary-progress-reports/grade/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }


    #endregion

}