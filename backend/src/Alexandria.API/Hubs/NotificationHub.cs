using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace Alexandria.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        if (Context.UserIdentifier != null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{Context.UserIdentifier}");
        await base.OnConnectedAsync();
    }
}
