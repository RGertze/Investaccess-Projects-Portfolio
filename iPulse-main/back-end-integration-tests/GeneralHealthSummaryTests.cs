
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

[Collection("GROUP_1")]
public class GeneralHealthSummaryTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string doctorToken2;
    private string patientToken;
    private string patientToken2;
    private string invalidToken;

    public GeneralHealthSummaryTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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
        doctorToken2 = jwtHandler.generate(3, 2);
        patientToken = jwtHandler.generate(4, 3);
        patientToken2 = jwtHandler.generate(5, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    #region Get all tests

    //----   GET ALL GENERAL HEALTH SUMMARIES FOR PATIENT, VALID   ----
    [Fact]
    public async Task GetAllGeneralHealthSummariesForPatientValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/4/health-summaries");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL GENERAL HEALTH SUMMARIES FOR PATIENT INVALID, NOT A DOCTOR OR PATIENT   ----
    [Fact]
    public async Task GetAllGeneralHealthSummariesForPatientInvalid_NotADoctorOrPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/4/health-summaries");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL GENERAL HEALTH SUMMARIES FOR PATIENT INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetAllGeneralHealthSummariesForPatientInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/4/health-summaries");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    #endregion

    #region Get single tests

    //----   GET SINGLE PATIENT GENERAL HEALTH SUMMARY, VALID   ----
    [Fact]
    public async Task GetSinglePatientHealthSummaryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/health-summaries/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET SINGLE PATIENT GENERAL HEALTH SUMMARY INVALID, NOT FOUND   ----
    [Fact]
    public async Task GetSinglePatientHealthSummaryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken2);
        var response = await client.GetAsync("api/patient/health-summaries/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET SINGLE PATIENT GENERAL HEALTH SUMMARY INVALID, INCORRECT PATIENT ID IN TOKEN   ----
    [Fact]
    public async Task GetSinglePatientHealthSummaryInvalid_IncorrectPatientIDInToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken2);
        var response = await client.GetAsync("api/patient/health-summaries/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET SINGLE PATIENT GENERAL HEALTH SUMMARY INVALID, NOT A DOCTOR OR PATIENT   ----
    [Fact]
    public async Task GetSinglePatientHealthSummaryInvalid_NotADoctorOrPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/health-summaries/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET SINGLE PATIENT GENERAL HEALTH SUMMARY INVALID, NO TOKEN   ----
    [Fact]
    public async Task GetSinglePatientHealthSummaryInvalid_NoToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/health-summaries/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }

    #endregion

    #region Add tests

    //----   ADD GENERAL HEALTH SUMMARY, VALID   ----
    [Fact]
    public async Task Post_AddGeneralHealthSummaryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddGeneralHealthSummary()
        {
            patientId = 4,
            doctorId = 2,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD GENERAL HEALTH SUMMARY INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task Post_AddGeneralHealthSummaryInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddGeneralHealthSummary()
        {
            patientId = 4,
            doctorId = 2,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD GENERAL HEALTH SUMMARY INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task Post_AddGeneralHealthSummaryInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddGeneralHealthSummary()
        {
            patientId = 400,
            doctorId = 2,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD GENERAL HEALTH SUMMARY INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_AddGeneralHealthSummaryInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddGeneralHealthSummary()
        {
            patientId = 4,
            doctorId = 200,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion

    #region Update tests

    //----   UPDATE GENERAL HEALTH SUMMARY, VALID   ----
    [Fact]
    public async Task Post_UpdateHealthSummaryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new EditGeneralHealthSummary()
        {
            id = 2,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE GENERAL HEALTH SUMMARY INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_UpdateHealthSummaryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new EditGeneralHealthSummary()
        {
            id = 100,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE GENERAL HEALTH SUMMARY INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task Post_UpdateHealthSummaryInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new EditGeneralHealthSummary()
        {
            id = 2,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/edit", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   UPDATE GENERAL HEALTH SUMMARY INVALID, DOCTOR TOKEN HAS WRONG ID   ----
    [Fact]
    public async Task Post_UpdateHealthSummaryInvalid_DoctorTokenHasWrongId()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken2);
        string jsonStr = JsonSerializer.Serialize(new EditGeneralHealthSummary()
        {
            id = 2,
            content = JsonSerializer.Serialize("{}"),
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/health-summaries/edit", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region Delete tests

    //----   DELETE GENERAL HEALTH SUMMARY VALID   ----
    [Fact]
    public async Task Post_DeleteHealthSummaryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/patient/health-summaries/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE GENERAL HEALTH SUMMARY INVALID, NOT FOUND   ----
    [Fact]
    public async Task Post_DeleteHealthSummaryInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/patient/health-summaries/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   DELETE GENERAL HEALTH SUMMARY INVALID, NOT A DOCTOR OR PATIENT   ----
    [Fact]
    public async Task Post_DeleteHealthSummaryInvalid_NotADoctorOrPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.DeleteAsync("api/patient/health-summaries/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   DELETE GENERAL HEALTH SUMMARY INVALID, DOCTOR TOKEN ID IS INCORRECT   ----
    [Fact]
    public async Task Post_DeleteHealthSummaryInvalid_DoctorTokenIdIncorrect()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken2);
        var response = await client.DeleteAsync("api/patient/health-summaries/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   DELETE GENERAL HEALTH SUMMARY INVALID, PATIENT TOKEN ID IS INCORRECT   ----
    [Fact]
    public async Task Post_DeleteHealthSummaryInvalid_PatientTokenIdIncorrect()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken2);
        var response = await client.DeleteAsync("api/patient/health-summaries/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion
}