
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using iPulse_back_end.Helpers;
using Microsoft.Extensions.Configuration;
using iPulse_back_end.Models;

namespace back_end_tests;

[Collection("GROUP_1")]
public class AuthTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public AuthTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   VALID LOGIN   ----
    [Fact]
    public async Task Post_ValidLogin_ReturnsOkWithToken()
    {
        string jsonStr = JsonSerializer.Serialize(new { username = "admin@gmail.com", password = "pw" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);

        Assert.True(response.IsSuccessStatusCode);
        _testOutputHelper.WriteLine(response.ToString());

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);

        Assert.True(data["data"]["token"] != null);
        _testOutputHelper.WriteLine(data.ToJsonString());
    }

    //----   INVALID LOGIN, USER NOT FOUND   ----
    [Fact]
    public async Task Post_InvalidUsernameLogin_ReturnsNotFound()
    {
        string jsonStr = JsonSerializer.Serialize(new { username = "a@gmail.com", password = "pw" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   INVALID LOGIN, WRONG PASSWORD   ----
    [Fact]
    public async Task Post_InvalidPasswordLogin_ReturnsForbidden()
    {
        string jsonStr = JsonSerializer.Serialize(new { username = "admin@gmail.com", password = "pwwww" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   VALID USER REGISTRATION   ----
    [Fact]
    public async Task Post_ValidUserRegistration_ReturnsCreated()
    {
        string jsonStr = JsonSerializer.Serialize(new
        {
            userType = 2,
            email = "g1@gmail.com",
            password = "password",
            firstName = "John",
            lastName = "Adriaans"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/account/register", content);

        Assert.True(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Created);
    }

    //----   INVALID USER REGISTRATION, USER EXISTS   ----
    [Fact]
    public async Task Post_InvalidUserRegistration_UserExists_ReturnsConflict()
    {
        string jsonStr = JsonSerializer.Serialize(new
        {
            userType = 1,
            email = "admin@gmail.com",
            password = "password",
            firstName = "John",
            lastName = "Adriaans"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/account/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   INVALID USER REGISTRATION, BAD REQUEST SENT   ----
    [Fact]
    public async Task Post_InvalidUserRegistration_BadRequest_ReturnsBadRequest()
    {
        string jsonStr = JsonSerializer.Serialize(new
        {
            userType = 1,
            email = "",
            password = "",
            firstName = "",
            lastName = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/account/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   VALID USER ACCOUNT CONFIRMATION   ----
    [Fact]
    public async Task Get_ValidUserAccountConfirmation()
    {
        var response = await client.GetAsync("api/auth/account/confirm/1/101");

        Assert.True(response.IsSuccessStatusCode);

        var content = await response.Content.ReadAsStringAsync();

        Assert.True(content != null);
        Assert.True(content.ToLower().Contains("success"));
    }

    //----   INVALID USER ACCOUNT CONFIRMATION, USER DOES NOT EXIST   ----
    [Fact]
    public async Task Get_InvalidUserAccountConfirmation_UserDoesNotExist()
    {
        var response = await client.GetAsync("api/auth/account/confirm/100/101");

        Assert.True(response.IsSuccessStatusCode);

        var content = await response.Content.ReadAsStringAsync();

        Assert.True(content != null);
        Assert.True(content.ToLower().Contains("not found"));
    }

    //----   VALID USER ACCOUNT DEREGISTRATION   ----
    [Fact]
    public async Task Get_ValidUserAccountDeregistration()
    {
        var response = await client.GetAsync("api/auth/account/deregister/3");

        Assert.True(response.IsSuccessStatusCode);

        var content = await response.Content.ReadAsStringAsync();

        Assert.True(content != null);
        Assert.True(content.ToLower().Contains("removed"));
    }

    //----   INVALID USER ACCOUNT DEREGISTRATION, USER DOES NOT EXIST   ----
    [Fact]
    public async Task Get_InvalidUserAccountDeregistration_UserDoesNotExist()
    {
        var response = await client.GetAsync("api/auth/account/deregister/100");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        var content = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(content);

        Assert.True(content != null);
        Assert.True(content.ToLower().Contains("not found"));
    }

    //----   TOKEN REFRESH VALID   ----
    [Fact]
    public async Task Post_TokenRefreshValid()
    {
        // admin with id 9 has default refresh token of 101
        string jsonStr = JsonSerializer.Serialize(new RefreshTokenRequest()
        {
            token = adminToken,
            refreshToken = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/token/refresh", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   TOKEN REFRESH INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_UserNotFound()
    {
        string jsonStr = JsonSerializer.Serialize(new RefreshTokenRequest()
        {
            token = invalidToken,
            refreshToken = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/token/refresh", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   TOKEN REFRESH INVALID, WRONG REFRESH TOKEN   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_WrongRefreshToken()
    {
        // the refresh token will be wrong regardless of if this test runs before the valid refresh test
        string jsonStr = JsonSerializer.Serialize(new RefreshTokenRequest()
        {
            token = adminToken,
            refreshToken = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/token/refresh", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   TOKEN REFRESH INVALID, BAD REQUEST, EMPTY/NULL VALUES   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_BadRequest_EmptyOrNullValues()
    {
        // the refresh token will be wrong regardless of if this test runs before the valid refresh test
        string jsonStr = JsonSerializer.Serialize(new RefreshTokenRequest()
        {
            token = adminToken,
            refreshToken = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/token/refresh", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   TOKEN REFRESH INVALID, BAD REQUEST, INVALID TOKEN   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_BadRequest()
    {
        // the refresh token will be wrong regardless of if this test runs before the valid refresh test
        string jsonStr = JsonSerializer.Serialize(new RefreshTokenRequest()
        {
            token = "an invalid token",
            refreshToken = "kjkn"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/token/refresh", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   REQUEST PASSWORD RESET CONFIRMATION CODE VALID   ----
    [Fact]
    public async Task RequestPasswordResetConfirmationCodeValid()
    {
        var response = await client.GetAsync("api/auth/password/reset/admin1@gmail.com");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REQUEST PASSWORD RESET CONFIRMATION CODE INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task RequestPasswordResetConfirmationCodeInvalid_UserNotFound()
    {
        var response = await client.GetAsync("api/auth/password/reset/1234555@email.com");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   CONFIRM PASSWORD RESET CONFIRMATION CODE VALID   ----
    [Fact]
    public async Task ConfirmPasswordResetConfirmationCodeValid()
    {
        string jsonStr = JsonSerializer.Serialize(new ConfirmPasswordReset()
        {
            email = "receptionist12@gmail.com",
            confirmationCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset/confirm", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   CONFIRM PASSWORD RESET CONFIRMATION CODE INVALID, USER NOT FOUND    ----
    [Fact]
    public async Task ConfirmPasswordResetConfirmationCodeInvalid_UserNotFound()
    {
        string jsonStr = JsonSerializer.Serialize(new ConfirmPasswordReset()
        {
            email = "receptionist12@gmail.com2222",
            confirmationCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset/confirm", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   CONFIRM PASSWORD RESET CONFIRMATION CODE INVALID, PASSWORD RESET NOT REQUESTED    ----
    [Fact]
    public async Task ConfirmPasswordResetConfirmationCodeInvalid_PasswordResetNotRequested()
    {
        string jsonStr = JsonSerializer.Serialize(new ConfirmPasswordReset()
        {
            email = "doc@gmail.com",
            confirmationCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset/confirm", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   CONFIRM PASSWORD RESET CONFIRMATION CODE INVALID, EXPIRED    ----
    [Fact]
    public async Task ConfirmPasswordResetConfirmationCodeInvalid_Expired()
    {
        string jsonStr = JsonSerializer.Serialize(new ConfirmPasswordReset()
        {
            email = "patient@gmail.com",
            confirmationCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset/confirm", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Gone);
    }

    //----   CONFIRM PASSWORD RESET CONFIRMATION CODE INVALID, EMPTY VALUES    ----
    [Fact]
    public async Task ConfirmPasswordResetConfirmationCodeInvalid_EmptyValues()
    {
        string jsonStr = JsonSerializer.Serialize(new ConfirmPasswordReset()
        {
            email = null,
            confirmationCode = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset/confirm", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   RESET PASSWORD VALID   ----
    [Fact]
    public async Task ResetPasswordValid()
    {
        string jsonStr = JsonSerializer.Serialize(new ResetPassword()
        {
            email = "patient1@gmail.com",
            password = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   RESET PASSWORD INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task ResetPasswordInvalid_UserNotFound()
    {
        string jsonStr = JsonSerializer.Serialize(new ResetPassword()
        {
            email = "patient1@gmail.com2222",
            password = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   RESET PASSWORD INVALID, ATTEMPT EXPIRED   ----
    [Fact]
    public async Task ResetPasswordInvalid_AttemptExpired()
    {
        string jsonStr = JsonSerializer.Serialize(new ResetPassword()
        {
            email = "doc2@gmail.com",
            password = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Gone);
    }

    //----   RESET PASSWORD INVALID, ATTEMPT NOT CONFIRMED   ----
    [Fact]
    public async Task ResetPasswordInvalid_AttemptNotConfirmed()
    {
        string jsonStr = JsonSerializer.Serialize(new ResetPassword()
        {
            email = "doc3@gmail.com",
            password = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   RESET PASSWORD INVALID, ATTEMPT ALREADY USED   ----
    [Fact]
    public async Task ResetPasswordInvalid_AttemptAlreadyUsed()
    {
        string jsonStr = JsonSerializer.Serialize(new ResetPassword()
        {
            email = "doc2@gmail.com",
            password = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Gone);
    }

    //----   RESET PASSWORD INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task ResetPasswordInvalid_EmptyValues()
    {
        string jsonStr = JsonSerializer.Serialize(new ResetPassword()
        {
            email = null,
            password = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/password/reset", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }
}