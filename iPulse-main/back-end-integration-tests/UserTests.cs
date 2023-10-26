
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using Pulse_back_end.Models;
using Microsoft.Extensions.Configuration;
using iPulse_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_2")]
public class UserTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public UserTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);
        _testOutputHelper = testOutputHelper;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(9, 1);
        doctorToken = jwtHandler.generate(2, 2);
        patientToken = jwtHandler.generate(4, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    //----   GET USER, VALID   ----
    [Fact]
    public async Task GetUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/user/1");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET USER, INVALID   ----
    [Fact]
    public async Task GetUserInValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/user/100");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET USER PROFILE PIC, VALID   ----
    [Fact]
    public async Task GetUserProfilePicValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/user/profile-pic/1");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET USER PROFILE PIC, INVALID   ----
    [Fact]
    public async Task GetUserProfilePicInValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/user/profile-pic/100");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE USER PROFILE PIC, VALID   ----
    [Fact]
    public async Task Post_UpdateUserProfilePicValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UserProfilePicUpdateRequest()
        {
            userId = 2,
            profilePicPath = "some-path"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/profile-pic", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE USER PROFILE PIC, INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task Post_UpdateUserProfilePicInvalid_UserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new
        {
            userId = 100,
            profilePicPath = "some-path"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/profile-pic", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE USER PROFILE PIC, INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_UpdateUserProfilePicInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new
        {
            userId = "",
            profilePicPath = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/profile-pic", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   UPDATE USER VALID   ----
    [Fact]
    public async Task Post_UpdateUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "doc@gmail.com",
            firstName = "Dr doctor",
            lastName = "proctor",
            profilePicPath = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/update", content);

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE USER INVALID   ----
    [Fact]
    public async Task Post_UpdateUserInvalid_UserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "docccccccccccccc@gmail.com",
            firstName = "Dr doctor",
            lastName = "proctor",
            profilePicPath = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/update", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE USER VALID   ----
    [Fact]
    public async Task Post_DeleteUserValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/user/15");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE USER INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_DeleteUserInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/user/15000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE USER INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task Post_DeleteUserInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.DeleteAsync("api/user/30000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL USERS VALID   ----
    [Fact]
    public async Task GetAllUsersValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/user/all");
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL USERS INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task GetAllUsersInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/user/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL DOCTORS   ----
    [Fact]
    public async Task GetAllDoctors()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/user/doctors");
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL PATIENTS   ----
    [Fact]
    public async Task GetAllPatients()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/user/doctors");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DOCTOR REGISTRATION VALID   ----
    [Fact]
    public async Task Post_DoctorRegistrationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "doc1@gmail.com",
            nationality = "Namibian",
            specialty = 1,
            practiceName = "Hells Pass",
            practiceNumber = "0101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/doctor/register", content);

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DOCTOR REGISTRATION INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task Post_DoctorRegistrationInvalid_UserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "g1@gmail.com",
            nationality = "Namibian",
            specialty = 1,
            practiceName = "Hells Pass",
            practiceNumber = "0101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/doctor/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DOCTOR REGISTRATION INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_DoctorRegistrationInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "",
            nationality = "",
            specialty = 1,
            practiceName = "",
            practiceNumber = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/doctor/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   PATIENT REGISTRATION VALID   ----
    [Fact]
    public async Task Post_PatientRegistrationValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "patient2@gmail.com",
            idNumber = "00101300204",
            medicalAidScheme = 1,
            memberNumber = "abc123"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/patient/register", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   PATIENT REGISTRATION INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task Post_PatientRegistrationInvalid_UserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "patient1234567890@gmail.com",
            idNumber = "00101300204",
            medicalAidScheme = 1,
            memberNumber = "abc123"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/patient/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   PATIENT REGISTRATION INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_PatientRegistrationInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "",
            idNumber = "",
            medicalAidScheme = 1,
            memberNumber = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/patient/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #region User Account status tests

    //----   UPDATE USER ACCOUNT STATUS, VALID   ----
    [Fact]
    public async Task Post_UpdateUserAccountStatusValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserAccountStatus()
        {
            userId = 1,
            status = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/account-status", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE USER ACCOUNT STATUS INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task Post_UpdateUserAccountStatusInvalid_UserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserAccountStatus()
        {
            userId = 10000,
            status = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/account-status", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE USER ACCOUNT STATUS INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task Post_UpdateUserAccountStatusInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserAccountStatus()
        {
            userId = null,
            status = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/account-status", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   UPDATE USER ACCOUNT STATUS INVALID, STATUS OUT OF RANGE   ----
    [Fact]
    public async Task Post_UpdateUserAccountStatusInvalid_StatusOutOfRange()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserAccountStatus()
        {
            userId = 1,
            status = 10
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/account-status", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion
}