using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.Services;

public class LocationTrackingService : ILocationTrackingService
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;
    private readonly ILogger<LocationTrackingService> _logger;

    public LocationTrackingService(IApplicationDbContext context, IDateTime dateTime, ILogger<LocationTrackingService> logger)
    {
        _context = context;
        _dateTime = dateTime;
        _logger = logger;
    }

    public async Task SaveDriverLocationAsync(Guid driverId, Guid? tripId, double latitude, double longitude, double? speed, double? heading)
    {
        var location = new UserLocation
        {
            UserId = driverId,
            TripId = tripId,
            Latitude = latitude,
            Longitude = longitude,
            Speed = speed,
            Heading = heading,
            Timestamp = _dateTime.Now
        };

        _context.UserLocations.Add(location);
        await _context.SaveChangesAsync();
    }

    public async Task<DriverLocationDto?> GetLatestDriverLocationAsync(Guid driverId)
    {
        var location = await _context.UserLocations
            .Where(l => l.UserId == driverId && !l.IsDeleted)
            .OrderByDescending(l => l.Timestamp)
            .FirstOrDefaultAsync();

        if (location == null) return null;

        return MapToDto(location);
    }

    public async Task<List<DriverLocationDto>> GetTripLocationHistoryAsync(Guid tripId)
    {
        var locations = await _context.UserLocations
            .Where(l => l.TripId == tripId && !l.IsDeleted)
            .OrderBy(l => l.Timestamp)
            .ToListAsync();

        return locations.Select(MapToDto).ToList();
    }

    public async Task<TripLocationHistoryDto> GetTripLocationAnalysisAsync(Guid tripId)
    {
        var locations = await _context.UserLocations
            .Where(l => l.TripId == tripId && !l.IsDeleted)
            .OrderBy(l => l.Timestamp)
            .ToListAsync();

        var dto = new TripLocationHistoryDto { TripId = tripId };
        if (locations.Count == 0) return dto;

        dto.Locations = locations.Select(MapToDto).ToList();

        double totalDist = 0;
        double maxSpeed = 0;
        double speedSum = 0;
        int speedCount = 0;

        for (int i = 1; i < locations.Count; i++)
        {
            var prev = locations[i - 1];
            var curr = locations[i];
            totalDist += Haversine(prev.Latitude, prev.Longitude, curr.Latitude, curr.Longitude);
        }

        foreach (var loc in locations)
        {
            if (loc.Speed.HasValue)
            {
                speedSum += loc.Speed.Value;
                speedCount++;
                if (loc.Speed.Value > maxSpeed) maxSpeed = loc.Speed.Value;
            }
        }

        dto.TotalDistanceKm = Math.Round(totalDist, 2);
        dto.MaxSpeed = Math.Round(maxSpeed, 2);
        dto.AverageSpeed = speedCount > 0 ? Math.Round(speedSum / speedCount, 2) : 0;

        if (locations.Count >= 2)
        {
            var first = locations.First().Timestamp;
            var last = locations.Last().Timestamp;
            dto.Duration = last - first;
        }

        return dto;
    }

    public async Task<List<DriverLocationDto>> GetActiveDriversNearbyAsync(double latitude, double longitude, double radiusKm)
    {
        var fiveMinutesAgo = _dateTime.Now.AddMinutes(-5);

        var recentLocations = await _context.UserLocations
            .Where(l => l.Timestamp >= fiveMinutesAgo && !l.IsDeleted && l.TripId != null)
            .GroupBy(l => l.UserId)
            .Select(g => g.OrderByDescending(l => l.Timestamp).First())
            .ToListAsync();

        return recentLocations
            .Where(l => Haversine(latitude, longitude, l.Latitude, l.Longitude) <= radiusKm)
            .Select(MapToDto)
            .ToList();
    }

    private DriverLocationDto MapToDto(UserLocation location)
    {
        return new DriverLocationDto
        {
            DriverId = location.UserId,
            TripId = location.TripId,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            Speed = location.Speed ?? 0,
            Heading = location.Heading ?? 0,
            Timestamp = location.Timestamp
        };
    }

    private static double Haversine(double lat1, double lon1, double lat2, double lon2)
    {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }
}
