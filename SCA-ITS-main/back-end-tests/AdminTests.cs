
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;
using SCA_ITS_back_end.Models;

namespace back_end_tests;

[Collection("GROUP_1")]
public class AdminTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public AdminTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //---   GET PARENT REGISTRATION REQUESTS VALID  ---
    [Fact]
    public async Task GetParentRegistrationRequestsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/admin/parent/registration/all");

        Assert.True(response.IsSuccessStatusCode);
    }

    //---   GET PARENT REGISTRATION REQUESTS INVALID, NOT AN ADMIN TOKEN  ---
    [Fact]
    public async Task GetParentRegistrationRequestsInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/admin/parent/registration/all");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   APPROVE PARENT REGISTRATION VALID   ----
    [Fact]
    public async Task Post_ApproveParentRegistrationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectParentRegistrationRequest()
        {
            userId = 5
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/parent/registration/approve", content);
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

    //----   REJECT PARENT REGISTRATION VALID   ----
    [Fact]
    public async Task Post_RejectParentRegistrationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectParentRegistrationRequest()
        {
            userId = 5,
            reason = "idk"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/parent/registration/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   APPROVE STUDENT REGISTRATION VALID   ----
    [Fact]
    public async Task Post_ApproveStudentRegistrationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectStudentRegistrationRequest()
        {
            studentNumber = "220038627"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/student/registration/approve", content);

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

    //----   REJECT STUDENT REGISTRATION VALID   ----
    [Fact]
    public async Task Post_RejectStudentRegistrationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new RejectStudentRegistration()
        {
            studentNumber = "220038627",
            registrationStage = (int)STUDENT_REGISTRATION_STATUS.ADD_MEDICAL_DETAILS,
            reason = "idk"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/student/registration/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //---   GET STUDENT REGISTRATION REQUESTS VALID  ---
    [Fact]
    public async Task GetStudentRegistrationRequestsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/admin/student/registration/all");

        Assert.True(response.IsSuccessStatusCode);
    }

    //---   GET STUDENT REGISTRATION REQUESTS INVALID, NOT AN ADMIN TOKEN  ---
    [Fact]
    public async Task GetStudentRegistrationRequestsInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/admin/student/registration/all");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //---   GET ALL PARENTS VALID  ---
    [Fact]
    public async Task GetAllParentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/parent/all");

        Assert.True(response.IsSuccessStatusCode);
    }

    //---   GET ALL PARENTS INVALID, NOT AN ADMIN TOKEN  ---
    [Fact]
    public async Task GetAllParentsInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/parent/all");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }


    //----   GET ALL STUDENTS VALID   ----
    [Fact]
    public async Task GetAllStudentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/student/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL STUDENTS INVALID, NOT AN ADMIN TOKEN  ----
    [Fact]
    public async Task GetAllStudentsInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/student/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }


    #region User password updates

    //----   UPDATE USER PASSWORD VALID   ----
    [Fact]
    public async Task UpdateUserPasswordValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 2,
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/users/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE USER PASSWORD INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task UpdateUserPasswordInvalid_UserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 20000,
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/users/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE USER PASSWORD INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task UpdateUserPasswordInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 2,
            password = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/users/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   UPDATE USER PASSWORD INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task UpdateUserPasswordInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 2,
            password = "ppw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/admin/users/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion
}
