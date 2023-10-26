
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

namespace back_end_tests;

[Collection("APPOINTMENTS")]
public class TestHubTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly ITestOutputHelper _testOutputHelper;
    private readonly IConfiguration config;
    private readonly CustomWebApplicationFactory<Program> factory;
    private string adminToken;
    private string doctorToken;
    private string patientToken;
    private string invalidToken;

    public TestHubTests(CustomWebApplicationFactory<Program> factory, ITestOutputHelper testOutputHelper)
    {
        factory.CreateDefaultClient();
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
            var ws = new HubConnectionBuilder().WithUrl("http://localhost/hubs/test", o =>
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

    [Fact]
    public async Task NewMessageValid()
    {
        var ws = await getConnection(adminToken);
        Assert.NotNull(ws);

        var username = "";
        var message = "";
        ws.On<string, string>("messageReceived", (uname, msg) =>
        {
            username = uname;
            message = msg;
        });

        await ws.InvokeAsync("NewMessage", "john", "hello");

        await Task.Delay(100);

        Assert.True(message.Equals("hello"));

    }

    [Fact]
    public async Task NewMessageInvalid_NotAuthorized()
    {
        var ws = await getConnection("");
        Assert.Null(ws);
    }
}