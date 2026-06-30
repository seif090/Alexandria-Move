using Alexandria.Domain.Entities;

namespace Alexandria.Application.Common.Interfaces;

public class DriverLocationDto
{
    public Guid DriverId { get; set; }
    public Guid? TripId { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double Speed { get; set; }
    public double Heading { get; set; }
    public DateTime Timestamp { get; set; }
}

public class TripLocationHistoryDto
{
    public Guid TripId { get; set; }
    public List<DriverLocationDto> Locations { get; set; } = new();
    public double TotalDistanceKm { get; set; }
    public double AverageSpeed { get; set; }
    public double MaxSpeed { get; set; }
    public TimeSpan Duration { get; set; }
}

public interface ILocationTrackingService
{
    Task SaveDriverLocationAsync(Guid driverId, Guid? tripId, double latitude, double longitude, double? speed, double? heading);
    Task<DriverLocationDto?> GetLatestDriverLocationAsync(Guid driverId);
    Task<List<DriverLocationDto>> GetTripLocationHistoryAsync(Guid tripId);
    Task<TripLocationHistoryDto> GetTripLocationAnalysisAsync(Guid tripId);
    Task<List<DriverLocationDto>> GetActiveDriversNearbyAsync(double latitude, double longitude, double radiusKm);
}
