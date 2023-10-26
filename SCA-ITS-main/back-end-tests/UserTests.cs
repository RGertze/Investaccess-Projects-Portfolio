
using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using SCA_ITS_back_end.Services;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_3")]
public class UserTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
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
        adminToken = jwtHandler.generate(4, 1);
        parentToken = jwtHandler.generate(2, 2);
        staffToken = jwtHandler.generate(3, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    #region Get


    #endregion

    #region Update Password as logged in user

    //----   UPDATE USER PASSWORD VALID, USER ID 2 TOKEN USER ID 2, PARENT   ----
    [Fact]
    public async Task UpdateUserPasswordValid_UserId2TokenUserId2_Parent()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 2,
            password = "ppw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE USER PASSWORD VALID, USER ID 4 TOKEN USER ID 4, ADMIN   ----
    [Fact]
    public async Task UpdateUserPasswordValid_UserId4TokenUserId4_Admin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 4,
            password = "ppww"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE USER PASSWORD VALID, USER ID 3 TOKEN USER ID 3, STAFF   ----
    [Fact]
    public async Task UpdateUserPasswordValid_UserId3TokenUserId3_Staff()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", staffToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 3,
            password = "ppww"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE USER PASSWORD INVALID, JWT TOKEN NOT FOR USER BEING EDITED   ----
    [Fact]
    public async Task UpdateUserPasswordInvalid_JwtTokenNotForUserBeingEdited()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", staffToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = 4,
            password = "ppww"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   UPDATE USER PASSWORD INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task UpdateUserPasswordInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", staffToken);
        string jsonStr = JsonSerializer.Serialize(new UpdateUserPassword()
        {
            userId = null,
            password = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/user/password/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    #endregion

}