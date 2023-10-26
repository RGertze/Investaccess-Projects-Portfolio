
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using Microsoft.Extensions.Configuration;
using back_end.Utilities;
using back_end.Models;

namespace back_end_tests;

[Collection("GROUP_1")]
public class AuthTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string userToken;
    private string invalidToken;

    public AuthTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        _testOutputHelper = testOutputHelper;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(1, 1);
        userToken = jwtHandler.generate(2, 2);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    //----   VALID LOGIN   ----
    [Fact]
    public async Task Post_ValidLogin_ReturnsOkWithToken()
    {
        string jsonStr = JsonSerializer.Serialize(new { email = "admin@admin.com", password = "Admin@123" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);

        Assert.True(response.IsSuccessStatusCode);
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());
    }

    //----   INVALID LOGIN, USER NOT FOUND   ----
    [Fact]
    public async Task Post_InvalidemailLogin_ReturnsNotFound()
    {
        string jsonStr = JsonSerializer.Serialize(new { email = "a@gmail.com", password = "pw" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   INVALID LOGIN, WRONG PASSWORD   ----
    [Fact]
    public async Task Post_InvalidPasswordLogin_ReturnsUnauthorized()
    {
        string jsonStr = JsonSerializer.Serialize(new { email = "admin@admin.com", password = "pwwww" });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/login", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   VALID USER REGISTRATION   ----
    [Fact]
    public async Task Post_ValidUserRegistration_ReturnsCreated()
    {
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "g1@gmail.com",
            password = "password",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/register", content);

        Assert.True(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Created);
    }

    //----   INVALID USER REGISTRATION, USER EXISTS   ----
    [Fact]
    public async Task Post_InvalidUserRegistration_UserExists_ReturnsConflict()
    {
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "admin@admin.com",
            password = "password",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   INVALID USER REGISTRATION, BAD REQUEST SENT   ----
    [Fact]
    public async Task Post_InvalidUserRegistration_BadRequest_ReturnsBadRequest()
    {
        string jsonStr = JsonSerializer.Serialize(new
        {
            email = "",
            password = "",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/register", content);

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   TOKEN REFRESH VALID   ----
    [Fact]
    public async Task Post_TokenRefreshValid()
    {
        string jsonStr = JsonSerializer.Serialize(new ApiTokens()
        {
            token = userToken,
            refreshToken = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/refresh-token", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   TOKEN REFRESH INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_UserNotFound()
    {
        string jsonStr = JsonSerializer.Serialize(new ApiTokens()
        {
            token = invalidToken,
            refreshToken = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/refresh-token", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   TOKEN REFRESH INVALID, WRONG REFRESH TOKEN   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_WrongRefreshToken()
    {
        // the refresh token will be wrong regardless of if this test runs before the valid refresh test
        string jsonStr = JsonSerializer.Serialize(new ApiTokens()
        {
            token = adminToken,
            refreshToken = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/refresh-token", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   TOKEN REFRESH INVALID, BAD REQUEST, EMPTY/NULL VALUES   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_BadRequest_EmptyOrNullValues()
    {
        // the refresh token will be wrong regardless of if this test runs before the valid refresh test
        string jsonStr = JsonSerializer.Serialize(new ApiTokens()
        {
            token = adminToken,
            refreshToken = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/refresh-token", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   TOKEN REFRESH INVALID, BAD REQUEST, INVALID TOKEN   ----
    [Fact]
    public async Task Post_TokenRefreshInvalid_BadRequest()
    {
        // the refresh token will be wrong regardless of if this test runs before the valid refresh test
        string jsonStr = JsonSerializer.Serialize(new ApiTokens()
        {
            token = "an invalid token",
            refreshToken = "kjkn"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/auth/refresh-token", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }
}