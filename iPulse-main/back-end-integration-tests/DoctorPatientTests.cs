
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Net;
using Xunit;
using Xunit.Abstractions;
using iPulse_back_end.Models;
using Microsoft.Extensions.Configuration;
using iPulse_back_end.Helpers;
using iPulse_back_end.Helpers.Enums;

namespace back_end_tests;

[Collection("GROUP_1")]
public class DoctorPatientTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public DoctorPatientTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET PATIENT PROFILE FOR DOCTOR VALID   ----
    [Fact]
    public async Task GetPatientProfileForDoctorValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access?patientId=4&doctorId=2");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PATIENT PROFILE FOR DOCTOR INVALID, DOCTOR NOT AUTHORIZED   ----
    [Fact]
    public async Task GetPatientProfileForDoctorInvalid_DoctorNotAuthorized()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access?patientId=4&doctorId=3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET PATIENT PROFILE FOR DOCTOR INVALID, PROFILE NOT FOUND   ----
    [Fact]
    public async Task GetPatientProfileForDoctorInvalid_ProfileNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access?patientId=999&doctorId=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET PATIENT PROFILE FOR DOCTOR INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task GetPatientProfileForDoctorInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access?patientId=4&doctorId=1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET PATIENT PROFILE FOR DOCTOR INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task GetPatientProfileForDoctorInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/profile/access?patientId=4&doctorId=1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET PROFILE ACCESS REQUEST STATUS VALID   ----
    [Fact]
    public async Task GetProfileAccessRequestStatuseValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access/check?patientId=4&doctorId=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PROFILE ACCESS REQUEST STATUS INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task GetProfileAccessRequestStatuseInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access/check?patientId=1000&doctorId=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET PROFILE ACCESS REQUEST STATUS INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task GetProfileAccessRequestStatuseInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/patient/profile/access/check?patientId=1000&doctorId=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REQUEST PATIENT PROFILE ACCESS VALID, NEW REQUEST   ----
    [Fact]
    public async Task Post_RequestPatientProfileAccessValid_NewRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ProfileAccessRequest()
        {
            doctorId = 6,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REQUEST PATIENT PROFILE ACCESS VALID, UPDATE EXISTING REQUEST   ----
    [Fact]
    public async Task Post_RequestPatientProfileAccessValid_UpdateExistingRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ProfileAccessRequest()
        {
            doctorId = 7,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REQUEST PATIENT PROFILE ACCESS INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_RequestPatientProfileAccessInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ProfileAccessRequest()
        {
            doctorId = 1,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   REQUEST PATIENT PROFILE ACCESS INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task Post_RequestPatientProfileAccessInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ProfileAccessRequest()
        {
            doctorId = 2,
            patientId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   REQUEST PATIENT PROFILE ACCESS INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task Post_RequestPatientProfileAccessInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ProfileAccessRequest()
        {
            doctorId = 2,
            patientId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET PROFILE ACCESS REQUESTS VALID   ----
    [Fact]
    public async Task GetProfileAccessRequestsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/profile/access/requests/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PROFILE ACCESS REQUESTS INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task GetProfileAccessRequestsInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/profile/access/requests/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET PROFILE ACCESS REQUESTS INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task GetProfileAccessRequestsInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access/requests/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   APPROVE PATIENT PROFILE ACCESS VALID   ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 2,
            patientId = 4,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/approve", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   APPROVE PATIENT PROFILE ACCESS INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 100,
            patientId = 4,
            approvalCode = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/approve", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   APPROVE PATIENT PROFILE ACCESS INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 100,
            patientId = 4,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/approve", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   APPROVE PATIENT PROFILE ACCESS INVALID, INCORRECT APPROVAL CODE   ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessInvalid_IncorrectApprovalCode()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 2,
            patientId = 4,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/approve", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   APPROVE PATIENT PROFILE ACCESS INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 2,
            patientId = 4,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/approve", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   APPROVE PATIENT PROFILE ACCESS VIA LINK VALID    ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessViaLinkValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/approve?patientId=4&doctorId=2&approvalCode=101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   APPROVE PATIENT PROFILE ACCESS VIA LINK INVALID, RECORD NOT FOUND    ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessViaLinkInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/approve?patientId=100&doctorId=2&approvalCode=101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   APPROVE PATIENT PROFILE ACCESS VIA LINK INVALID, RECORD NOT FOUND    ----
    [Fact]
    public async Task Post_ApprovePatientProfileAccessViaLinkInvalid_WrongCode()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/approve?patientId=4&doctorId=2&approvalCode=10001");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }


    //----   REJECT PATIENT PROFILE ACCESS VIA LINK VALID    ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessViaLinkValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/reject?patientId=4&doctorId=2&approvalCode=101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REJECT PATIENT PROFILE ACCESS VIA LINK INVALID, RECORD NOT FOUND    ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessViaLinkInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/reject?patientId=100&doctorId=2&approvalCode=101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   REJECT PATIENT PROFILE ACCESS VIA LINK INVALID, RECORD NOT FOUND    ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessViaLinkInvalid_WrongCode()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/reject?patientId=4&doctorId=2&approvalCode=10001");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REJECT PATIENT PROFILE ACCESS VALID   ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 8,
            patientId = 4,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/reject", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REJECT PATIENT PROFILE ACCESS INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 8,
            patientId = 4,
            approvalCode = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/reject", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   REJECT PATIENT PROFILE ACCESS INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessInvalid_RecordNotFound()
    {

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 1000,
            patientId = 4,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/reject", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   REJECT PATIENT PROFILE ACCESS INVALID, INCORRECT APPROVAL CODE   ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessInvalid_IncorrectApprovalCode()
    {

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 8,
            patientId = 4,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/reject", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REJECT PATIENT PROFILE ACCESS INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task Post_RejectPatientProfileAccessInvalid_NotAPatient()
    {

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 8,
            patientId = 4,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/reject", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }


    //----   GET DOCTORS WITH PROFILE ACCESS VALID   ----
    [Fact]
    public async Task GetDoctorsWithProfileAccessValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/patient/profile/access/all/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET DOCTORS WITH PROFILE ACCESS INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task GetDoctorsWithProfileAccessInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/patient/profile/access/all/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REVOKE PATIENT PROFILE ACCESS VALID   ----
    [Fact]
    public async Task Post_RevokePatientProfileAccessValid()
    {

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 10,
            patientId = 4,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/revoke", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REVOKE PATIENT PROFILE ACCESS INVALID, WRONG APPROVAL CODE   ----
    [Fact]
    public async Task Post_RevokePatientProfileAccessInvalid_NotAPatient()
    {

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 10,
            patientId = 4,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/revoke", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REVOKE PATIENT PROFILE ACCESS INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task Post_RevokePatientProfileAccessInvalid_RecordNotFound()
    {

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            doctorId = 13,
            patientId = 4,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/patient/profile/access/revoke", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }


    //----   REQUEST DOCTOR TO BE PERSONAL DOCTOR VALID, NEW REQUEST   ----
    [Fact]
    public async Task Post_RequestDoctorToBePersonalDoctorValid_NewRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new RequestDoctorToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 2,
            typeId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REQUEST DOCTOR TO BE PERSONAL DOCTOR VALID, EXISTING REQUEST   ----
    [Fact]
    public async Task Post_RequestDoctorToBePersonalDoctorValid_ExistingRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new RequestDoctorToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 6,
            typeId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REQUEST DOCTOR TO BE PERSONAL DOCTOR INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task Post_RequestDoctorToBePersonalDoctorInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new RequestDoctorToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 3,
            typeId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REQUEST DOCTOR TO BE PERSONAL DOCTOR INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task Post_RequestDoctorToBePersonalDoctorInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new RequestDoctorToBePersonalDoctor()
        {
            patientId = 1,
            doctorId = 3,
            typeId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   REQUEST DOCTOR TO BE PERSONAL DOCTOR INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_RequestDoctorToBePersonalDoctorInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new RequestDoctorToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 1,
            typeId = 1
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   REQUEST DOCTOR TO BE PERSONAL DOCTOR INVALID, BAD REQUEST   ----
    [Fact]
    public async Task Post_RequestDoctorToBePersonalDoctorInvalid_BadRequest()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new RequestDoctorToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 3,
            typeId = null
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   APPROVE REQUEST TO BE PERSONAL DOCTOR VALID   ----
    [Fact]
    public async Task Post_ApproveRequestToBePersonalDoctorValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectRequestToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 6,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests/approve", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   APPROVE REQUEST TO BE PERSONAL DOCTOR INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task Post_ApproveRequestToBePersonalDoctorInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectRequestToBePersonalDoctor()
        {
            patientId = 1,
            doctorId = 2,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests/approve", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   APPROVE REQUEST TO BE PERSONAL DOCTOR INVALID, WRONG APPROVAL CODE   ----
    [Fact]
    public async Task Post_ApproveRequestToBePersonalDoctorInvalid_WrongApprovalCode()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectRequestToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 6,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests/approve", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   APPROVE REQUEST TO BE PERSONAL DOCTOR INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task Post_ApproveRequestToBePersonalDoctorInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectRequestToBePersonalDoctor()
        {
            patientId = 4,
            doctorId = 3,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests/approve", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REJECT REQUEST TO BE PERSONAL DOCTOR VALID   ----
    [Fact]
    public async Task Post_RejectRequestToBePersonalDoctorValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            patientId = 4,
            doctorId = 7,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REJECT REQUEST TO BE PERSONAL DOCTOR INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task Post_RejectRequestToBePersonalDoctorInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            patientId = 1,
            doctorId = 2,
            approvalCode = "101"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   REJECT REQUEST TO BE PERSONAL DOCTOR INVALID, WRONG APPROVAL CODE   ----
    [Fact]
    public async Task Post_RejectRequestToBePersonalDoctorInvalid_WrongApprovalCode()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new ApproveRejectProfileAccessRequest()
        {
            patientId = 4,
            doctorId = 6,
            approvalCode = "10001"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/doctor/personal/requests/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }






    //----   GET DOCTOR PATIENT TYPES VALID   ----
    [Fact]
    public async Task GetDoctorPatientTypesValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/doctor/personal/types");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PERSONAL DOCTOR REQUEST STATUS VALID   ----
    [Fact]
    public async Task GetPersonalDoctorRequestStatuseValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/doctor/personal/requests/check?patientId=4&doctorId=6");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PERSONAL DOCTOR REQUEST STATUS INVALID, RECORD NOT FOUND   ----
    [Fact]
    public async Task GetPersonalDoctorRequestStatuseInvalid_RecordNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/doctor/personal/requests/check?patientId=1000&doctorId=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET PERSONAL DOCTOR REQUEST STATUS INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task GetPersonalDoctorRequestStatuseInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/doctor/personal/requests/check?patientId=1000&doctorId=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET PERSONAL DOCTOR REQUESTS VALID   ----
    [Fact]
    public async Task GetPersonalDoctorRequestsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/personal/requests/6");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PERSONAL DOCTOR REQUESTS INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task GetPersonalDoctorRequestsInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/doctor/personal/requests/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET PERSONAL DOCTOR REQUESTS INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task GetPersonalDoctorRequestsInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/doctor/personal/requests/3");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }
}

