
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
public class AuthTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public AuthTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
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

    //----   VALID LOGIN   ----
    [Fact]
    public async Task Post_ValidLogin_ReturnsOkWithToken()
    {
        string jsonStr = JsonSerializer.Serialize(new { username = "admin@gmail.com", password = "pw" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);

        Assert.True(response.IsSuccessStatusCode);

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
    public async Task Post_InvalidPasswordLogin_ReturnsUnauthorized()
    {
        string jsonStr = JsonSerializer.Serialize(new { username = "admin@gmail.com", password = "pwwww" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

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
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Redirect);

        var content = await response.Content.ReadAsStringAsync();

    }

    //----   INVALID USER ACCOUNT CONFIRMATION, USER DOES NOT EXIST   ----
    [Fact]
    public async Task Get_InvalidUserAccountConfirmation_UserDoesNotExist()
    {
        var response = await client.GetAsync("api/auth/account/confirm/100/101");

        Assert.True(response.StatusCode == HttpStatusCode.Redirect);

        var content = await response.Content.ReadAsStringAsync();
    }

    //----   VALID USER ACCOUNT DEREGISTRATION   ----
    [Fact]
    public async Task Get_ValidUserAccountDeregistration()
    {
        var response = await client.GetAsync("api/auth/account/deregister/3");

        Assert.True(response.IsSuccessStatusCode);

        // var content = await response.Content.ReadAsStringAsync();

        // Assert.True(content != null);
        // Assert.True(content.ToLower().Contains("removed"));
    }

    //----   INVALID USER ACCOUNT DEREGISTRATION, USER DOES NOT EXIST   ----
    [Fact]
    public async Task Get_InvalidUserAccountDeregistration_UserDoesNotExist()
    {
        var response = await client.GetAsync("api/auth/account/deregister/100");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        var content = await response.Content.ReadAsStringAsync();

        Assert.True(content != null);
        Assert.True(content.ToLower().Contains("not exist"));
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
}