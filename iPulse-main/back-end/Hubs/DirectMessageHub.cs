using iPulse_back_end.DB_Models;
using iPulse_back_end.Helpers;
using iPulse_back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR;

namespace SignalRWebpack.Hubs;

[Authorize]
[Route("hubs/direct-message")]
public class DirectMessageHub : Hub
{
    private IConfiguration configuration;
    private ILogger logger;

    public DirectMessageHub(IConfiguration configuration, ILogger<DirectMessageHub> logger)
    {
        this.configuration = configuration;
        this.logger = logger;
    }

    public override Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext != null)
        {
            var token = httpContext.Request.Query["access_token"];
            var jwtHandler = new JwtHandler(configuration);

            // get token details 
            var principal = jwtHandler.getPrincipalFromToken(token);

            // check if details retrieved
            if (principal is null)
            {
                return base.OnConnectedAsync();
            }

            // get userId from claims
            var uClaim = principal.Claims.Where(c => c.Type == "userId").FirstOrDefault();

            if (uClaim is null)
            {
                return base.OnConnectedAsync();
            }

            var userId = uClaim.Value;

            // add user to group
            Groups.AddToGroupAsync(Context.ConnectionId, $"dm-{userId}");

            logger.LogCritical($"dm-{userId}");
        }

        return base.OnConnectedAsync();
    }
}