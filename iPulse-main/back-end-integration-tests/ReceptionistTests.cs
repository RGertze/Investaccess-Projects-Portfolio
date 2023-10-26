
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using Pulse_back_end.Models;
using iPulse_back_end.Models;
using Microsoft.Extensions.Configuration;
using iPulse_back_end.Helpers;

namespace back_end_tests;

[Collection("GROUP_2")]
public class ReceptionistTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public ReceptionistTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET ALL RECEPTIONISTS FOR DOCTOR VALID   ----
    [Fact]
    public async Task GetAllReceptionistsForDoctorValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/receptionists/all/2");
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL RECEPTIONISTS FOR DOCTOR INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task GetAllReceptionistsForDoctorInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/receptionists/all/1");
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD RECEPTIONIST VALID   ----
    [Fact]
    public async Task Post_AddReceptionistValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddReceptionistRequest()
        {
            doctorId = 2,
            email = "random@email.com",
            firstName = "a name",
            lastName = "a name",
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/receptionists/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD RECEPTIONIST INVALID, ALREADY EXISTS   ----
    [Fact]
    public async Task Post_AddReceptionistInvalid_AlreadyExists()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddReceptionistRequest()
        {
            doctorId = 2,
            email = "receptionist@gmail.com",
            firstName = "a name",
            lastName = "a name",
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/receptionists/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD RECEPTIONIST INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_AddReceptionistInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddReceptionistRequest()
        {
            doctorId = 1,
            email = "random123@email.com",
            firstName = "a name",
            lastName = "a name",
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/receptionists/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD RECEPTIONIST INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task Post_AddReceptionistInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddReceptionistRequest()
        {
            doctorId = null,
            email = "",
            firstName = "",
            lastName = "a name",
            password = "pw"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/receptionists/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   DELETE RECEPTIONIST VALID   ----
    [Fact]
    public async Task DeleteReceptionistValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/receptionists/11");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE RECEPTIONIST INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteReceptionistInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/receptionists/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }
}