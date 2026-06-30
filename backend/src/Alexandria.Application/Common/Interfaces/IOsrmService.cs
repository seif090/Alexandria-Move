namespace Alexandria.Application.Common.Interfaces;

public class OSRMRouteResult
{
    public List<Coordinate> Coordinates { get; set; } = new();
    public double DistanceKm { get; set; }
    public double DurationMinutes { get; set; }
    public string Geometry { get; set; } = string.Empty;
}

public class Coordinate
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class NearestRoadResult
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double DistanceMeters { get; set; }
}

public interface IOsrmService
{
    Task<OSRMRouteResult?> GetRouteAsync(double originLat, double originLng, double destLat, double destLng, List<Coordinate>? waypoints = null);
    Task<(double DistanceKm, double DurationMinutes)> GetDistanceDurationAsync(double originLat, double originLng, double destLat, double destLng);
    Task<List<Coordinate>> GetRouteGeometryAsync(double originLat, double originLng, double destLat, double destLng, List<Coordinate>? waypoints = null);
    Task<NearestRoadResult?> GetNearestRoadAsync(double latitude, double longitude);
}
