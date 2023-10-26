
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Net;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_1")]
public class ParentTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public ParentTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET PARENT PROFILE VALID   ----
    [Fact]
    public async Task GetParentProfileValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/parent/profile/2");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PARENT PROFILE INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task GetParentProfileInvalid_ParentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/parent/profile/1");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PARENT PROFILE VALID   ----
    [Fact]
    public async Task Post_EditParentProfileValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditParentProfileRequest()
        {
            userId = 2,
            idNumber = "12345678901",
            cellNumber = "029292929"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/parent/profile/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT PARENT PROFILE INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_EditParentProfileInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditParentProfileRequest()
        {
            userId = null,
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/parent/profile/edit", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   EDIT PARENT PROFILE INVALID, PARENT NOT FOUND   ----
    [Fact]
    public async Task Post_EditParentProfileInvalid_ParentNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new EditParentProfileRequest()
        {
            userId = 1,
            idNumber = "12345678901",
            cellNumber = "029292929"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/parent/profile/edit", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   AMDIN ADD PARENT VALID   ----
    [Fact]
    public async Task Post_AdminAddParentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddNewParentRequest()
        {
            email = "newP@gmail.com",
            password = "pw",
            firstName = "p",
            lastName = "p",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/parent/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   AMDIN ADD PARENT INVALID, PARENT ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AdminAddParentInvalid_ParentAlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddNewParentRequest()
        {
            email = "parent@gmail.com",
            password = "pw",
            firstName = "p",
            lastName = "p",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/parent/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   AMDIN ADD PARENT INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_AdminAddParentInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddNewParentRequest()
        {
            email = "newP1@gmail.com",
            password = "",
            firstName = "",
            lastName = "",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/parent/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   AMDIN ADD PARENT INVALID, NOT AN ADMIN TOKEN   ----
    [Fact]
    public async Task Post_AdminAddParentInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddNewParentRequest()
        {
            email = "newP22@gmail.com",
            password = "pw",
            firstName = "p",
            lastName = "p",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/parent/add", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

}