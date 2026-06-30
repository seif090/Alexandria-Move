using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Alexandria.Infrastructure.SignalR;

[Authorize]
public class NotificationHub : Hub
{
    public async Task JoinUserGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
    }

    public async Task MarkAsRead(string notificationId)
    {
        await Clients.Group($"user_{Context.UserIdentifier}").SendAsync("NotificationRead", notificationId);
    }

    public override async Task OnConnectedAsync()
    {
        if (Context.UserIdentifier != null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{Context.UserIdentifier}");
        await base.OnConnectedAsync();
    }
}
