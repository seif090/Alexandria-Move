using Alexandria.Application.Common.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace Alexandria.API.Hubs;

[Authorize]
public class TrackingHub : Hub
{
    private readonly ILocationTrackingService _locationTracking;
    private readonly ILogger<TrackingHub> _logger;

    public TrackingHub(ILocationTrackingService locationTracking, ILogger<TrackingHub> logger)
    {
        _locationTracking = locationTracking;
        _logger = logger;
    }

    public async Task JoinTripGroup(string tripId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"trip_{tripId}");
        _logger.LogInformation("User {UserId} joined trip group {TripId}", Context.UserIdentifier, tripId);
    }

    public async Task LeaveTripGroup(string tripId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"trip_{tripId}");
    }

    public async Task UpdateLocation(string tripId, double latitude, double longitude, double? speed, double? heading)
    {
        var driverId = Context.UserIdentifier;

        try
        {
            if (Guid.TryParse(driverId, out var driverGuid) && Guid.TryParse(tripId, out var tripGuid))
            {
                await _locationTracking.SaveDriverLocationAsync(
                    driverGuid, tripGuid, latitude, longitude, speed, heading);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to persist location for driver {DriverId}", driverId);
        }

        await Clients.Group($"trip_{tripId}").SendAsync("DriverLocationUpdated", new
        {
            TripId = tripId,
            DriverId = driverId,
            Latitude = latitude,
            Longitude = longitude,
            Speed = speed ?? 0,
            Heading = heading ?? 0,
            Timestamp = DateTime.UtcNow
        });
    }

    public async Task UpdateTripStatus(string tripId, string status)
    {
        await Clients.Group($"trip_{tripId}").SendAsync("TripStatusUpdated", new
        {
            TripId = tripId,
            Status = status,
            Timestamp = DateTime.UtcNow
        });
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected to TrackingHub: {ConnectionId}, User: {UserId}",
            Context.ConnectionId, Context.UserIdentifier);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected from TrackingHub: {ConnectionId}",
            Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
