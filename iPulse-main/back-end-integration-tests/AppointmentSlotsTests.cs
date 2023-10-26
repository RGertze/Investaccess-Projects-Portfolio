
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
public class AppointmentSlotsTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public AppointmentSlotsTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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

    //----   GET SLOTS FOR A DOCTOR VALID   ----
    [Fact]
    public async Task GetSlotsForDoctorValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/appointment-slots/doctor/2");
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET SLOTS FOR A DOCTOR INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task GetSlotsForDoctorInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
        var response = await client.GetAsync("api/appointment-slots/doctor/1");
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD SLOT VALID   ----
    [Fact]
    public async Task Post_AddSlotValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 1,
            startTime = "14:00:00",
            endTime = "15:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD SLOT VALID, TIME ENDING AT MIDNIGHT   ----
    [Fact]
    public async Task Post_AddSlotValid_TimeEndingAtMidnight()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 1,
            startTime = "23:00:00",
            endTime = "00:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   ADD SLOT INVALID, TIME ENDING AT MIDNIGHT, LESS THAN 15MIN   ----
    [Fact]
    public async Task Post_AddSlotValid_TimeEndingAtMidnight_LessThan15Min()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 2,
            startTime = "23:50:00",
            endTime = "00:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD SLOT INVALID, DOCTOR NOT FOUND   ----
    [Fact]
    public async Task Post_AddSlotInvalid_DoctorNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 1,
            day = 1,
            startTime = "14:00:00",
            endTime = "15:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD SLOT INVALID, DAY OUT OF RANGE, LESS THAN 1   ----
    [Fact]
    public async Task Post_AddSlotInvalid_DayOutOfRange_LessThan1()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 0,
            startTime = "14:00:00",
            endTime = "15:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD SLOT INVALID, DAY OUT OF RANGE, GREATER THAN 7   ----
    [Fact]
    public async Task Post_AddSlotInvalid_DayOutOfRange_GreaterThan7()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 8,
            startTime = "14:00:00",
            endTime = "15:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD SLOT INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task Post_AddSlotInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 7,
            startTime = "",
            endTime = ""
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD SLOT INVALID, CONFLICTING TIMES   ----
    [Fact]
    public async Task Post_AddSlotInvalid_ConflictingTimes()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 7,
            startTime = "14:00:00",
            endTime = "15:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Conflict);
    }

    //----   ADD SLOT INVALID, END TIME LESS THAN START TIME   ----
    [Fact]
    public async Task Post_AddSlotInvalid_EndTimeLessThanStartTime()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 6,
            startTime = "15:00:00",
            endTime = "14:00:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD SLOT INVALID, DURATION LESS THAN 15MIN   ----
    [Fact]
    public async Task Post_AddSlotInvalid_DurationLessThan15Min()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddAppointmentSlot()
        {
            doctorId = 2,
            day = 6,
            startTime = "15:00:00",
            endTime = "15:10:00"
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   ADD MULTIPLE SLOTS VALID   ----
    [Fact]
    public async Task Post_AddMultipleSlotsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new List<AddAppointmentSlot>(){
            new AddAppointmentSlot(){
                doctorId = 6,
                day = 1,
                startTime = "14:00:00",
                endTime = "15:00:00"
            },
            new AddAppointmentSlot(){
                doctorId = 6,
                day = 2,
                startTime = "14:00:00",
                endTime = "15:00:00"
            },
            new AddAppointmentSlot(){
                doctorId = 6,
                day = 3,
                startTime = "14:00:00",
                endTime = "15:00:00"
            },
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/multiple", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        var data = await response.Content.ReadFromJsonAsync<Response>();
        List<Response> individualResults = JsonSerializer.Deserialize<List<Response>>(data.data);

        Assert.True(individualResults.Count() == 3);
        _testOutputHelper.WriteLine(individualResults[0].errorMessage);
        _testOutputHelper.WriteLine(individualResults[1].errorMessage);
        _testOutputHelper.WriteLine(individualResults[2].errorMessage);
        Assert.True(individualResults[0].errorMessage == "" && individualResults[1].errorMessage == "" && individualResults[2].errorMessage == "");
    }

    //----   ADD MULTIPLE SLOTS INVALID, SLOT 2 CONFLICTS WITH SLOT 1   ----
    [Fact]
    public async Task Post_AddMultipleSlotsInvalid_Slot2ConflictsWithSlot1()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new List<AddAppointmentSlot>(){
            new AddAppointmentSlot(){
                doctorId = 6,
                day = 5,
                startTime = "14:00:00",
                endTime = "15:00:00"
            },
            new AddAppointmentSlot(){
                doctorId = 6,
                day = 5,
                startTime = "14:30:00",
                endTime = "15:30:00"
            },
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/multiple", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        var data = await response.Content.ReadFromJsonAsync<Response>();
        List<Response> individualResults = JsonSerializer.Deserialize<List<Response>>(data.data);

        Assert.True(individualResults.Count() == 2);
        Assert.True(individualResults[0].errorMessage.ToLower().Contains("conflict") && individualResults[1].errorMessage.ToLower().Contains("conflict"));
    }

    //----   ADD MULTIPLE SLOTS INVALID, SLOT 2 CONFLICTS WITH AN EXISTING SLOT   ----
    [Fact]
    public async Task Post_AddMultipleSlotsInvalid_Slot2ConflictsWithAnExisting()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new List<AddAppointmentSlot>(){
            new AddAppointmentSlot(){
                doctorId = 6,
                day = 6,
                startTime = "14:00:00",
                endTime = "15:00:00"
            },
            new AddAppointmentSlot(){
                doctorId = 6,
                day = 7,
                startTime = "10:00:00",
                endTime = "11:00:00"
            },
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointment-slots/multiple", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        var data = await response.Content.ReadFromJsonAsync<Response>();
        List<Response> individualResults = JsonSerializer.Deserialize<List<Response>>(data.data);

        Assert.True(individualResults.Count() == 2);
        Assert.True(individualResults[0].errorMessage.Length == 0 && individualResults[1].errorMessage.ToLower().Contains("conflict"));
    }

    //----   DELETE SLOT VALID   ----
    [Fact]
    public async Task DeleteSlotValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/appointment-slots/1");
        _testOutputHelper.WriteLine(response.ToString());
        _testOutputHelper.WriteLine(await response.Content.ReadAsStringAsync());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   DELETE SLOT INVALID, NOT FOUND   ----
    [Fact]
    public async Task DeleteSlotInvalid_NotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        var response = await client.DeleteAsync("api/appointment-slots/1000");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }
}