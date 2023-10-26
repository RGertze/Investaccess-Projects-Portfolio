
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
public class PatientNextofKinTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public PatientNextofKinTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    [Fact]
    public async Task GetPatientNextofKinValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/next-of-kin/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task GetPatientNextofKinInValid_notPatientOrDoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/next-of-kin/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   DELETE PATIENT NEXT OF KIN VALID   ----
    [Fact]
    public async Task Post_DeletePatientNextofKinValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.DeleteAsync("api/patient/next-of-kin/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE PATIENT NEXT OF KIN INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_DeletePatientNextofKinInValid_patientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.DeleteAsync("api/patient/next-of-kin/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE PATIENT NEXT OF KIN INVALID, NOT A PATIENT TOKEN   ----
    [Fact]
    public async Task Post_DeletePatientNextofKinInValid_notPatientOrDoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/patient/next-of-kin/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD PATIENT NEXT OF KIN, VALID   ----
    [Fact]
    public async Task Post_AddPatientNextofKinValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddPatientNextOfKin()
        {
            patientId = 4,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/next-of-kin", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD PATIENT NEXT OF KIN INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task Post_AddPatientNextOfKinInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddPatientNextOfKin()
        {
            patientId = 1000,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/next-of-kin", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD PATIENT NEXT OF KIN INVALID, BAD REQUEST, EMPTY VALUES   ----
    [Fact]
    public async Task Post_AddPatientNextOfKinInvalid_BadRequest_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddPatientNextOfKin()
        {
            patientId = 4,
            fullName = "",
            cellPhone = "",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/next-of-kin", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD PATIENT NEXT OF KIN INVALID, NOT A PA TOKEN   ----
    [Fact]
    public async Task Post_AddPatientNextOfKinInvalid_NotAPatientToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddPatientNextOfKin()
        {
            patientId = 1000,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/next-of-kin", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   EDIT PATIENT NEXT OF KIN, VALID   ----
    [Fact]
    public async Task Post_EditPatientNextofKinValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new EditPatientNextOfKin()
        {
            id = 2,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/next-of-kin/edit", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   EDIT PATIENT NEXT OF KIN INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_EditPatientNextOfKinInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new EditPatientNextOfKin()
        {
            id = 1000,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/next-of-kin/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   EDIT PATIENT NEXT OF KIN INVALID, NOT A PA TOKEN   ----
    [Fact]
    public async Task Post_EditPatientNextOfKinInvalid_NotAPatientToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new EditPatientNextOfKin()
        {
            id = 2,
            fullName = "John",
            cellPhone = "+264812345678",
            email = "email",
            residentialAddress = "res",
            relationship = "rel",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/next-of-kin/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }
}