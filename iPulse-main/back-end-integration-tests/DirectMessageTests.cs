
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

[Collection("GROUP_1")]
public class DirectMessageTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private readonly CustomWebApplicationFactory<Program> factory;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public DirectMessageTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
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
        patientToken = jwtHandler.generate(4, 3);
        invalidToken = jwtHandler.generate(10000000, 1);
    }

    private async Task<HubConnection?> getConnection(string token)
    {
        try
        {
            var ws = new HubConnectionBuilder().WithUrl("http://localhost/hubs/direct-message", o =>
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

    //----   ADD DIRECT MESSAGE VALID   ----
    [Fact]
    public async Task AddDirectMessageValid()
    {
        var ws = await getConnection(adminToken);
        Assert.NotNull(ws);

        DirectMessage? dm = null;
        ws.On<DirectMessage>(DirectMessageMethods.CLIENT_DIRECT_MESSAGE_RECEIVED, (data) =>
        {
            dm = data;
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

        Assert.NotNull(dm);
        Assert.True(dm.FromId == 2 && dm.ToId == 9);
    }

    //----   ADD DIRECT MESSAGE INVALID, FROM USER NOT FOUND   ----
    [Fact]
    public async Task AddDirectMessageInvalid_FromUserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDirectMessage()
        {
            fromId = 1000,
            toId = 2,
            content = "hello"
        });

        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/direct-message/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD DIRECT MESSAGE INVALID, TO USER NOT FOUND   ----
    [Fact]
    public async Task AddDirectMessageInvalid_ToUserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDirectMessage()
        {
            fromId = 1,
            toId = 2000,
            content = "hello"
        });

        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/direct-message/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   ADD DIRECT MESSAGE INVALID, EMPTY VALUES   ----
    [Fact]
    public async Task AddDirectMessageInvalid_EmptyValues()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);
        string jsonStr = JsonSerializer.Serialize(new AddDirectMessage()
        {
            fromId = 1,
            toId = 2,
            content = ""
        });

        HttpContent content = new StringContent(jsonStr, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("api/direct-message/", content);
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
    }

    //----   GET ALL DIRECT MESSAGES BETWEEN 2 USERS VALID   ----
    [Fact]
    public async Task GetAllDirectMessagesBetween2UsersValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);

        var response = await client.GetAsync("api/direct-message/all?user1Id=1&user2Id=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);
    }

    //----   GET ALL DIRECT MESSAGES BETWEEN 2 USERS INVALID, ONE OF THE USERS NOT FOUND   ----
    [Fact]
    public async Task GetAllDirectMessagesBetween2UsersInvalid_OneOfTheUsersNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);

        var response = await client.GetAsync("api/direct-message/all?user1Id=1000&user2Id=2");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET USERS BEING MESSAGED VALID   ----
    [Fact]
    public async Task GetUsersBeingMessagedValid()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);

        var response = await client.GetAsync("api/direct-message/users/1");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.True(response.IsSuccessStatusCode);

        JsonObject data = await response.Content.ReadFromJsonAsync<JsonObject>();
        Assert.True(data != null);
        Assert.True(data["data"] != null);
        _testOutputHelper.WriteLine(data["data"].ToString());
        Assert.True(data["data"] is JsonArray);
        Assert.True(((JsonArray)data["data"]).Count > 0);

        JsonObject obj1 = (JsonObject)(((JsonArray)data["data"])[0]);
        Assert.True((int)obj1["userId"] == 2);

        JsonObject obj2 = (JsonObject)(((JsonArray)data["data"])[1]);
        Assert.True((int)obj2["userId"] == 3);

    }

    //----   GET USERS BEING MESSAGED INVALID, USER NOT FOUND   ----
    [Fact]
    public async Task GetUsersBeingMessagedInvalid_UserNotFound()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", doctorToken);

        var response = await client.GetAsync("api/direct-message/users/400");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.NotFound);
    }

    //----   GET USERS BEING MESSAGED INVALID, NOT AUTHORIZED   ----
    [Fact]
    public async Task GetUsersBeingMessagedInvalid_NotAuthorized()
    {
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "");

        var response = await client.GetAsync("api/direct-message/users/4");
        _testOutputHelper.WriteLine(response.ToString());

        Assert.False(response.IsSuccessStatusCode);
        Assert.True(response.StatusCode == HttpStatusCode.Unauthorized);
    }
}