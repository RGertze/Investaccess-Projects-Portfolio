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
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.OpenApi.Any;
using iPulse_back_end.DB_Models;

namespace back_end_tests;

[Collection("GROUP_2")]
public class NotificationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private readonly CustomWebApplicationFactory<Program> factory;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;
    private string doctor8Token;

    public NotificationTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        client = factory.CreateDefaultClient();
        client.Timeout = TimeSpan.FromSeconds(600);
        _testOutputHelper = testOutputHelper;
        this.factory = factory;

        IConfigurationBuilder builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Development.json", false, true);
        config = builder.Build();

        JwtHandler jwtHandler = new JwtHandler(config);
        adminToken = jwtHandler.generate(9, 1);
        doctorToken = jwtHandler.generate(2, 2);
        doctor8Token = jwtHandler.generate(8, 2);
        patientToken = jwtHandler.generate(4, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    private async Task<HubConnection?> getConnection(string token)
    {
        try
        {
            var ws = new HubConnectionBuilder().WithUrl("http://localhost/hubs/notifications", o =>
                    {
                        o.Transports = HttpTransportType.WebSockets;
                        o.SkipNegotiation = true;
                        o.WebSocketFactory = (context, cancellationToken) =>
                        {
                            var wsClient = factory.Server.CreateWebSocketClient();
                            var uri = new UriBuilder($"{context.Uri}?access_token={token}");
                            _testOutputHelper.WriteLine(uri.ToString());
                            var webS = wsClient.ConnectAsync(uri.Uri, cancellationToken).GetAwaiter().GetResult();
                            return ValueTask.FromResult(webS);
                        };
                    }).Build();

            await ws.StartAsync();
            _testOutputHelper.WriteLine(ws.State.ToString());

            return ws;
        }
        catch (Exception ex)
        {
            _testOutputHelper.WriteLine(ex.Message);
            return null;
        }
    }

    //----   GET UNSEEN NOTIFICATIONS VALID   ----
    [Fact]
    public async Task GetUnseenNotificationsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);

        var response = await client.GetAsync("api/notifications/unseen/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL NOTIFICATIONS VALID   ----
    [Fact]
    public async Task GetAllNotificationsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);

        var response = await client.GetAsync("api/notifications/all/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   CHECK FOR NOTIFICATIONS VALID   ----
    [Fact]
    public async Task CheckForNotificationsValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);

        var response = await client.GetAsync("api/notifications/check/2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   MESSAGE RECEIVED NOTIFICATION VALID   ----
    [Fact]
    public async Task MessageReceivedNotificationValid()
    {
        var ws = await getConnection(adminToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDirectMessage()
        {
            fromId = 2,
            toId = 9,
            content = "hello"
        });

        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/direct-message/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 9);
        Assert.True(notification.TypeId == 1);
    }

    //----   APPOINTMENT REQUESTED NOTIFICATION VALID   ----
    [Fact]
    public async Task AppointmentRequestedNotificationValid()
    {
        var ws = await getConnection(doctorToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

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

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 2);
        Assert.True(notification.TypeId == 2);
    }

    //----   APPOINTMENT APPROVED NOTIFICATION VALID   ----
    [Fact]
    public async Task AppointmentApprovedNotificationValid()
    {
        var ws = await getConnection(patientToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

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

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 4);
        Assert.True(notification.TypeId == 2);
    }

    //----   APPOINTMENT REJECTED NOTIFICATION VALID   ----
    [Fact]
    public async Task AppointmentRejectedNotificationValid()
    {
        var ws = await getConnection(patientToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AppointmentStatusUpdateRequest()
        {
            appointmentId = 8,
            patientId = 4
        });
        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/appointments/reject", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 4);
        Assert.True(notification.TypeId == 2);
    }

    //----   APPOINTMENT APPROVED VIA LINK NOTIFICATION VALID   ----
    [Fact]
    public async Task AppointmentApprovedViaLinkNotificationValid()
    {
        var ws = await getConnection(patientToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

        var response = await client.GetAsync("api/appointments/approve/4/101");

        Assert.True(response.StatusCode == HttpStatusCode.Redirect);

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 4);
        Assert.True(notification.TypeId == 2);
    }

    //----   APPOINTMENT REJECTED VIA LINK NOTIFICATION VALID   ----
    [Fact]
    public async Task AppointmentRejectedViaLinkNotificationValid()
    {
        var ws = await getConnection(patientToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

        var response = await client.GetAsync("api/appointments/reject/7/101");

        Assert.True(response.StatusCode == HttpStatusCode.Redirect);

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 4);
        Assert.True(notification.TypeId == 2);
    }

    //----   APPOINTMENT CANCELLED NOTIFICATION VALID   ----
    [Fact]
    public async Task AppointmentCancelledNotificationValid()
    {
        var ws = await getConnection(patientToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

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

        await Task.Delay(300);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 4);
        Assert.True(notification.TypeId == 2);
    }

    //----   REQUEST PATIENT PROFILE ACCESS NOTIFICATION VALID   ----
    [Fact]
    public async Task RequestPatientProfileAccessNotificationValid()
    {
        var ws = await getConnection(patientToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

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

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 4);
        Assert.True(notification.TypeId == 3);
    }

    //----   APPROVE PATIENT PROFILE ACCESS REQUEST NOTIFICATION VALID   ----
    [Fact]
    public async Task ApprovePatientProfileAccessRequestNotificationValid()
    {
        var ws = await getConnection(doctorToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

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

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 2);
        Assert.True(notification.TypeId == 3);
    }

    //----   APPROVE PATIENT PROFILE ACCESS REQUEST VIA LINK NOTIFICATION VALID   ----
    [Fact]
    public async Task ApprovePatientProfileAccessRequestViaLinkNotificationValid()
    {
        var ws = await getConnection(doctorToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/approve?patientId=4&doctorId=2&approvalCode=101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 2);
        Assert.True(notification.TypeId == 3);
    }

    //----   REJECT PATIENT PROFILE ACCESS REQUEST NOTIFICATION VALID   ----
    [Fact]
    public async Task RejectPatientProfileAccessRequestNotificationValid()
    {
        var ws = await getConnection(doctor8Token);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

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

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 8);
        Assert.True(notification.TypeId == 3);
    }

    //----   REJECT PATIENT PROFILE ACCESS REQUEST VIA LINK NOTIFICATION VALID   ----
    [Fact]
    public async Task RejectPatientProfileAccessRequestViaLinkNotificationValid()
    {
        var ws = await getConnection(doctorToken);
        Assert.NotNull(ws);

        Notification? notification = null;
        ws.On<Notification>(NotificationMethods.CLIENT_NOTIFICATION_RECEIVED, (data) =>
        {
            notification = data;
        });

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");
        var response = await client.GetAsync("api/patient/profile/access/reject?patientId=4&doctorId=2&approvalCode=101");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        await Task.Delay(100);

        Assert.NotNull(notification);
        Assert.True(notification.UserId == 2);
        Assert.True(notification.TypeId == 3);
    }
}

