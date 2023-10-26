
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
public class AppointmentTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public AppointmentTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    #region Get appointments

    //----   GET APPOINTMENT USING CODE VALID   ----
    [Fact]
    public async Task GetAppointmentUsingCodeValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/appointments/single?id=6&code=101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET APPOINTMENT USING CODE INVALID, NOT FOUND   ----
    [Fact]
    public async Task GetAppointmentUsingCodeInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/appointments/single?id=10000&code=101");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET APPOINTMENT USING CODE INVALID, WRONG CODE   ----
    [Fact]
    public async Task GetAppointmentUsingCodeInvalid_WrongCode()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/appointments/single?id=6&code=10001");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL APPOINTMENTS VALID   ----
    [Fact]
    public async Task GetAllAppointmentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/appointments");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL APPOINTMENTS INVALID, NOT AN ADMIN   ----
    [Fact]
    public async Task GetAllAppointmentsInvalid_NotAnAdmin()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL APPOINTMENTS FOR DOCTOR   ----
    [Fact]
    public async Task GetAllAppointmentsForDoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/doctor/3");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL APPOINTMENTS FOR PATIENT VALID   ----
    [Fact]
    public async Task GetAllAppointmentsForPatientValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/patient/4");

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL APPOINTMENTS FOR PATIENT INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task GetAllAppointmentsForPatientInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/appointments/patient/4");

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion

    #region Add appointment
    //----   ADD APPOINTMENT VALID   ----
    [Fact]
    public async Task Post_AddAppointmentValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 2,
            patientId = 4,
            title = "some title",
            description = "desc?",
            date = "2023-07-20"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD APPOINTMENT VALID, TAKE REJECTED APPOINTMENT SLOT   ----
    [Fact]
    public async Task Post_AddAppointmentValid_TakeRejectedAppointmentSlot()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 3,
            patientId = 4,
            title = "some title",
            description = "desc?",
            date = "2023-07-25"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD APPOINTMENT INVALID, NOT A PATIENT   ----
    [Fact]
    public async Task Post_AddAppointmentInvalid_NotAPatient()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 2,
            patientId = 4,
            title = "some title",
            description = "desc?",
            date = "2023-07-20"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   ADD APPOINTMENT INVALID, SLOT CONFLICT   ----
    [Fact]
    public async Task Post_AddAppointmentInvalid_SlotConflict()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 2,
            patientId = 4,
            title = "some title",
            description = "desc?",
            date = "2023-07-25",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD APPOINTMENT INVALID, INVALID DATE   ----
    [Fact]
    public async Task Post_AddAppointmentInvalid_InvalidDate()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 2,
            patientId = 4,
            title = "some title",
            description = "desc?",
            date = "por que?",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD APPOINTMENT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task Post_AddAppointmentInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 2,
            patientId = 4,
            title = "",
            description = "desc?",
            date = "",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD APPOINTMENT INVALID, SLOT NOT FOUND   ----
    [Fact]
    public async Task Post_AddAppointmentInvalid_SlotNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 100000,
            patientId = 4,
            title = "some title",
            description = "desc?",
            date = "2023-07-25",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD APPOINTMENT INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task Post_AddAppointmentInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentRequest()
        {
            slotId = 2,
            patientId = 1,
            title = "some title",
            description = "desc?",
            date = "2023-07-29",
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    #endregion

    #region Approve/Reject appointment

    //----   APPROVE APPOINTMENT VALID   ----
    [Fact]
    public async Task Post_ApproveAppointment()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AppointmentStatusUpdateRequest()
        {
            appointmentId = 1,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/approve", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   APPROVE APPOINTMENT INVALID, APPOINTMENT DOES NOT EXIST   ----
    [Fact]
    public async Task Post_ApproveAppointmentInvalid_DoesNotExist()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AppointmentStatusUpdateRequest()
        {
            appointmentId = 0,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/approve", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.InternalServerError);
    }

    //----   APPROVE APPOINTMENT INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task Post_ApproveAppointmentInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AppointmentStatusUpdateRequest()
        {
            appointmentId = 1,
            patientId = 99
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/approve", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   REJECT APPOINTMENT VALID   ----
    [Fact]
    public async Task Post_RejectAppointment()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AppointmentStatusUpdateRequest()
        {
            appointmentId = 8,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/reject", content);
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   REJECT APPOINTMENT INVALID, APPOINTMENT DOES NOT EXIST   ----
    [Fact]
    public async Task Post_RejectAppointmentInvalid_DoesNotExist()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AppointmentStatusUpdateRequest()
        {
            appointmentId = 0,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.InternalServerError);
    }

    //----   REJECT APPOINTMENT INVALID, NOT A DOCTOR   ----
    [Fact]
    public async Task Post_RejectAppointmentInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        string jsonStr = JsonSerializer.Serialize(new AppointmentStatusUpdateRequest()
        {
            appointmentId = 8,
            patientId = 99
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   APPROVE APPOINTMENT VIA LINK VALID   ----
    [Fact]
    public async Task Get_ApproveAppointmentViaLinkValid()
    {
        var response = await client.GetAsync("api/appointments/approve/4/101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.Redirect);
    }

    //----   APPROVE APPOINTMENT VIA LINK INVALID, APPOINTMENT DOES NOT EXIST   ----
    [Fact]
    public async Task Get_ApproveAppointmentViaLinkInvalid_AppointmentDoesNotExist()
    {
        var response = await client.GetAsync("api/appointments/approve/9999/101");

        Assert.True(response.IsSuccessStatusCode);

        string content = await response.Content.ReadAsStringAsync();
        Assert.True(content.ToLower().Contains("appointment not found"));
    }

    //----   APPROVE APPOINTMENT VIA LINK INVALID, WRONG CODE   ----
    [Fact]
    public async Task Get_ApproveAppointmentViaLinkInvalid_WrongCode()
    {
        var response = await client.GetAsync("api/appointments/approve/4/10001");

        Assert.True(response.IsSuccessStatusCode);

        string content = await response.Content.ReadAsStringAsync();
        Assert.True(content.ToLower().Contains("incorrect code"));
    }

    //----   REJECT APPOINTMENT VIA LINK VALID   ----
    [Fact]
    public async Task Get_RejectAppointmentViaLinkValid()
    {
        var response = await client.GetAsync("api/appointments/reject/7/101");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.StatusCode == HttpStatusCode.Redirect);
    }

    //----   REJECT APPOINTMENT VIA LINK INVALID, APPOINTMENT DOES NOT EXIST   ----
    [Fact]
    public async Task Get_RejectAppointmentViaLinkInvalid_AppointmentDoesNotExist()
    {
        var response = await client.GetAsync("api/appointments/reject/9999/101");

        Assert.True(response.IsSuccessStatusCode);

        string content = await response.Content.ReadAsStringAsync();
        Assert.True(content.ToLower().Contains("appointment not found"));
    }

    //----   REJECT APPOINTMENT VIA LINK INVALID, WRONG CODE   ----
    [Fact]
    public async Task Get_RejectAppointmentViaLinkInvalid_WrongCode()
    {
        var response = await client.GetAsync("api/appointments/reject/7/10001");

        Assert.True(response.IsSuccessStatusCode);

        string content = await response.Content.ReadAsStringAsync();
        Assert.True(content.ToLower().Contains("incorrect code"));
    }

    #endregion

    #region Upcoming/historical appointments

    //----   GET ALL UPCOMING PATIENT APPOINTMENTS VALID   ----
    [Fact]
    public async Task GetAllUpcomingPatientAppointmentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/patient/upcoming/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL UPCOMING PATIENT APPOINTMENTS INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task GetAllUpcomingPatientAppointmentsInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/patient/upcoming/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET ALL UPCOMING PATIENT APPOINTMENTS INVALID, NOT A PATIENT TOKEN   ----
    [Fact]
    public async Task GetAllUpcomingPatientAppointmentsInvalid_NotAPatientToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/patient/upcoming/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET PATIENT APPOINTMENT HISTORY VALID   ----
    [Fact]
    public async Task GetPatientAppointmentHistoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/patient/history/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET PATIENT APPOINTMENT HISTORY INVALID, PATIENT NOT FOUND   ----
    [Fact]
    public async Task GetPatientAppointmentHistoryInvalid_PatientNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/patient/history/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET PATIENT APPOINTMENT HISTORY INVALID, NOT A PATIENT TOKEN   ----
    [Fact]
    public async Task GetPatientAppointmentHistoryInvalid_NotAPatientToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/patient/history/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL PENDING DOCTOR APPOINTMENTS VALID   ----
    [Fact]
    public async Task GetAllPendingDoctorAppointmentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/doctor/pending/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL PENDING DOCTOR APPOINTMENTS INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task GetAllPendingDoctorAppointmentsInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/doctor/pending/2000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET ALL PENDING DOCTOR APPOINTMENTS INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task GetAllPendingDoctorAppointmentsInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/doctor/pending/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET ALL UPCOMING DOCTOR APPOINTMENTS VALID   ----
    [Fact]
    public async Task GetAllUpcomingDoctorAppointmentsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/doctor/upcoming/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL UPCOMING DOCTOR APPOINTMENTS INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task GetAllUpcomingDoctorAppointmentsInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/doctor/upcoming/2000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET ALL UPCOMING DOCTOR APPOINTMENTS INVALID, NOT A DOCTOR TOKEN   ----
    [Fact]
    public async Task GetAllUpcomingDoctorAppointmentsInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/doctor/upcoming/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    //----   GET DOCTOR APPOINTMENT HISTORY VALID   ----
    [Fact]
    public async Task GetDoctorAppointmentHistoryValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/doctor/history/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET DOCTOR APPOINTMENT HISTORY INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task GetDoctorAppointmentHistoryInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.GetAsync("api/appointments/doctor/history/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET DOCTOR APPOINTMENT HISTORY INVALID, NOT A PATIENT TOKEN   ----
    [Fact]
    public async Task GetDoctorAppointmentHistoryInvalid_NotADoctorToken()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", patientToken);
        var response = await client.GetAsync("api/appointments/doctor/history/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }



    #endregion

    #region Cancel appointment

    //----   CANCEL APPOINTMENT AS DOCTOR VALID   ----
    [Fact]
    public async Task Post_CancelAppointmentAsDoctorValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new CancelAppointment()
        {
            appointmentId = 3,
            userId = 2,
            reason = "emergency came up, sorry"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/cancel", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   CANCEL APPOINTMENT AS PATIENT VALID   ----
    [Fact]
    public async Task Post_CancelAppointmentAsPatientValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new CancelAppointment()
        {
            appointmentId = 4,
            userId = 4,
            reason = "emergency came up, sorry"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/cancel", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   CANCEL APPOINTMENT INVALID, APPOINTMENT DOES NOT EXIST   ----
    [Fact]
    public async Task Post_CancelAppointmentInvalid_DoesNotExist()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new CancelAppointment()
        {
            appointmentId = 10000,
            userId = 2,
            reason = "emergency came up, sorry"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/cancel", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   CANCEL APPOINTMENT INVALID, USER NOT PART OF APPOINTMENT   ----
    [Fact]
    public async Task Post_CancelAppointmentInvalid_UserNotPartOfAppointment()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new CancelAppointment()
        {
            appointmentId = 1,
            userId = 5,
            reason = "emergency came up, sorry"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/cancel", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   CANCEL APPOINTMENT INVALID, NOT A DOCTOR OR PATIENT   ----
    [Fact]
    public async Task Post_CancelAppointmentInvalid_NotADoctor()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        string jsonStr = JsonSerializer.Serialize(new CancelAppointment()
        {
            appointmentId = 10000,
            userId = 2,
            reason = "emergency came up, sorry"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/cancel", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    #endregion
}

