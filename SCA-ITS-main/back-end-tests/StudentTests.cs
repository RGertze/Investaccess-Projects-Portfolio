
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

[Collection("GROUP_2")]
public class StudentTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public StudentTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET STUDENT VALID   ----
    [Fact]
    public async Task GetStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/student/220038627");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET STUDENT  INVALID, STUDENT NOT FOUND   ----
    [Fact]
    public async Task GetStudentInvalid_StudentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/student/1");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT STUDENT  VALID   ----
    [Fact]
    public async Task Post_EditStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditStudentRequest()
        {
            studentNumber = "220038627",
            firstName = "fnn",
            lastName = "lnn",
            dob = "2022-10-11",
            grade = 4,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        // moodle service might be unavailable but the test should still pass if that section of code is reached
        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to update moodle user"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT STUDENT INVALID, STUDENT NOT FOUND   ----
    [Fact]
    public async Task Post_EditStudentInvalid_StudentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditStudentRequest()
        {
            studentNumber = "220038620",
            firstName = "fnn",
            lastName = "lnn",
            dob = "2022-10-11",
            grade = 4,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/edit", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----    ADD STUDENT VALID   ----
    [Fact]
    public async Task Post_AddStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 2,
            firstName = "fn",
            lastName = "ln",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----    ADD STUDENT INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task Post_AddStudentInvalid_ParentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 1,
            firstName = "fn",
            lastName = "ln",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----    ADD STUDENT INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_AddStudentInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 2,
            firstName = "",
            lastName = "",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----    ADD STUDENT INVALID, NOT PARENT TOKEN   ----
    [Fact]
    public async Task Post_AddStudentInvalid_NotAParentToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", staffToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 2,
            firstName = "sdkfjn",
            lastName = "sfdkjn",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----    ADMIN ADD STUDENT VALID   ----
    [Fact]
    public async Task Post_AdminAddStudentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 2,
            firstName = "fn",
            lastName = "ln",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/admin/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        var json = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(json);

        // moodle service might be unavailable but the test should still pass if that section of code is reached
        if (!response.IsSuccessStatusCode)
        {
            Assert.True(json.Contains("Failed to create moodle user"));
            return;
        }

        Assert.True(response.IsSuccessStatusCode);
    }

    //----    ADMIN ADD STUDENT INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task Post_AdminAddStudentInvalid_ParentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 1,
            firstName = "fn",
            lastName = "ln",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/admin/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----    ADMIN ADD STUDENT INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_AdminAddStudentInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 2,
            firstName = "",
            lastName = "",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/admin/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----    ADMIN ADD STUDENT INVALID, NOT AN ADMIN TOKEN   ----
    [Fact]
    public async Task Post_AdminAddStudentInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", staffToken);
        string jsonStr = JsonSerializer.Serialize(new AddStudentRequest()
        {
            parentId = 2,
            firstName = "sdkfjn",
            lastName = "sfdkjn",
            dob = "2022-10-11",
            grade = 3
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/student/admin/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET STUDENTS FOR PARENT VALID   ----
    [Fact]
    public async Task GetStudentsForParentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/student/parent/all/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET STUDENTS FOR PARENT INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task GetStudentsForParentInvalid_ParentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/student/parent/all/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET STUDENTS FOR STAFF VALID   ----
    [Fact]
    public async Task GetStudentsForStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", staffToken);
        var response = await client.GetAsync("api/student/staff/all/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET STUDENTS FOR STAFF INVALID, STAFF NOT FOUND   ----
    [Fact]
    public async Task GetStudentsForStaffInvalid_StaffNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", staffToken);
        var response = await client.GetAsync("api/student/staff/all/300");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }
}