
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using SCA_ITS_back_end.Models;
using Microsoft.Extensions.Configuration;
using SCA_ITS_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_2")]
public class StaffTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string parentToken;
    private string staffToken;
    private string invalidToken;

    public StaffTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET STAFF VALID   ----
    [Fact]
    public async Task GetStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/staff/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET STAFF INVALID, STAFF NOT FOUND   ----
    [Fact]
    public async Task GetStaffInvalid_StaffNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/staff/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET STAFF INVALID, NOT AUTHORIZED   ----
    [Fact]
    public async Task GetStaffInvalid_NotAuthorized()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/staff/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    //----   ADD STAFF VALID   ----
    [Fact]
    public async Task Post_AddStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStaffRequest()
        {
            email = "staffem@gmail.com",
            firstName = "j",
            lastName = "a",
            password = "pW@12345678"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/staff/", content);
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

    //----   ADD STAFF INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AddStaffInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStaffRequest()
        {
            email = "staff@gmail.com",
            firstName = "j",
            lastName = "a",
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/staff/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD STAFF INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task Post_AddStaffInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddStaffRequest()
        {
            email = "staff999@gmail.com",
            firstName = "",
            lastName = "",
            password = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/staff/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD STAFF INVALID, NOT AN ADMIN TOKEN   ----
    [Fact]
    public async Task Post_AddStaffInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        string jsonStr = JsonSerializer.Serialize(new AddStaffRequest()
        {
            email = "staff1234@gmail.com",
            firstName = "j",
            lastName = "a",
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/staff/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL STAFF VALID   ----
    [Fact]
    public async Task GetAllStaffValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/staff/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL STAFF INVALID, NOT AN ADMIN TOKEN   ----
    [Fact]
    public async Task GetAllStaffInvalid_NotAnAdminToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", parentToken);
        var response = await client.GetAsync("api/staff/all");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }
}

