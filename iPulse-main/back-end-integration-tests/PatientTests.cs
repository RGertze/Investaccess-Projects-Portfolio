
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
public class PatientTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public PatientTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET ALL BLOOD TYPES VALID   ----
    [Fact]
    public async Task GetAllBloodTypes()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/blood-types");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL GENDERS VALID   ----
    [Fact]
    public async Task GetAllGenders()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/genders");

        Assert.True(response.IsSuccessStatusCode);
    }

    #region Patient Profile tests

    //----   GET PATIENT PROFILE VALID   ----
    [Fact]
    public async Task GetPatientProfileValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/profile/4");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PATIENT PROFILE INVALID, PROFILE NOT FOUND   ----
    [Fact]
    public async Task GetPatientProfileInvalid_ProfileNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/profile/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE PATIENT PROFILE, VALID   ----
    [Fact]
    public async Task Post_UpdatePatientProfileValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new PatientProfileUpdateRequest()
        {
            UserId = 4,
            MedicalAidSchemeId = 1,
            IdNumber = "11113333111",
            MemberNumber = "2009",
            Nationality = "namibian",
            ResidentialAddress = "addr",
            PostalAddress = "pos addr",
            Age = null,
            Gender = null,
            BloodType = null,
            SecondaryCellphone = "999999999"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   UPDATE PATIENT PROFILE INVALID, PROFILE NOT FOUND   ----
    [Fact]
    public async Task Post_UpdatePatientProfileInvalid_ProfileNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new PatientProfileUpdateRequest()
        {
            UserId = 1,
            MedicalAidSchemeId = 1,
            IdNumber = "11113333111",
            MemberNumber = "2009",
            Nationality = "namibian",
            ResidentialAddress = "addr",
            PostalAddress = "pos addr",
            Age = null,
            Gender = null,
            BloodType = null,
            SecondaryCellphone = "999999999"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   UPDATE PATIENT PROFILE INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task Post_UpdatePatientProfileInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new PatientProfileUpdateRequest()
        {
            UserId = 1,
            MedicalAidSchemeId = 1,
            IdNumber = "11113333111",
            MemberNumber = "2009",
            Nationality = "namibian",
            ResidentialAddress = "addr",
            PostalAddress = "pos addr",
            Age = null,
            Gender = null,
            BloodType = null,
            SecondaryCellphone = "999999999"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/update", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region Patient Doctor tests

    //----   GET DOCTORS FOR A PATIENT VALID   ----
    [Fact]
    public async Task GetDoctorsForAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/doctors/4");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET DOCTORS FOR A PATIENT INVALID, NOT A PATIENT TOKEN   ----
    [Fact]
    public async Task GetDoctorsForAPatientInvalid_NotAPatientToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/doctors/4");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region Patient Search tests

    //----   SEARCH PATIENTS BY NAME VALID   ----
    [Fact]
    public async Task SearchPatientsByNameValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/search?firstName=DeAd&lastName=IeNt");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count > 0);
    }

    //----   SEARCH PATIENTS BY EMAIL VALID   ----
    [Fact]
    public async Task SearchPatientsByEmailValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/search?email=t1@");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count == 1);
    }

    //----   SEARCH DOCTOR PATIENTS BY EMAIL VALID   ----
    [Fact]
    public async Task SearchDoctorPatientsByEmailValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/search?doctorId=7");

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count == 1);
    }

    //----   SEARCH PATIENTS INVALID, NOT A DOCTOR OR RECEPTIONIST   ----
    [Fact]
    public async Task SearchPatientsInvalid_NotADoctorOrReceptionist()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/search?email=t1@");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion
}