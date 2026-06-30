using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Alexandria.Infrastructure.SignalR;

[Authorize]
public class TrackingHub : Hub
{
    public async Task JoinTripGroup(string tripId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"trip_{tripId}");
    }

    public async Task LeaveTripGroup(string tripId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"trip_{tripId}");
    }

    public async Task UpdateDriverLocation(string tripId, double latitude, double longitude)
    {
        await Clients.Group($"trip_{tripId}").SendAsync("DriverLocationUpdated", new { tripId, latitude, longitude, timestamp = DateTime.UtcNow });
    }

    public async Task UpdateTripStatus(string tripId, string status)
    {
        await Clients.Group($"trip_{tripId}").SendAsync("TripStatusUpdated", new { tripId, status, timestamp = DateTime.UtcNow });
    }

    public async Task NotifyPassengerPickup(string tripId, string passengerId)
    {
        await Clients.Group($"trip_{tripId}").SendAsync("PassengerPickedUp", new { tripId, passengerId, timestamp = DateTime.UtcNow });
    }

    public async Task SendMessage(string userId, string message)
    {
        await Clients.User(userId).SendAsync("ReceiveMessage", message);
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}
