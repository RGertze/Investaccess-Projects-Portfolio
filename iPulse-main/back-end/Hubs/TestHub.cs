using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR;

namespace SignalRWebpack.Hubs;

[Authorize]
[Route("hubs/test")]
public class TestHub : Hub
{
    public async Task NewMessage(string username, string message) =>
        await Clients.All.SendAsync("messageReceived", username, message);
}