using Alexandria.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.Maps;

public class MapService : IMapService
{
    private readonly IOsrmService _osrmService;
    private readonly INominatimService _nominatimService;
    private readonly ILogger<MapService> _logger;

    public MapService(IOsrmService osrmService, INominatimService nominatimService, ILogger<MapService> logger)
    {
        _osrmService = osrmService;
        _nominatimService = nominatimService;
        _logger = logger;
    }

    public async Task<(double Distance, double Duration)> CalculateDistanceAsync(
        double originLat, double originLng, double destLat, double destLng)
    {
        var result = await _osrmService.GetDistanceDurationAsync(originLat, originLng, destLat, destLng);
        return (result.DistanceKm, result.DurationMinutes);
    }

    public async Task<string> GetDirectionsAsync(
        double originLat, double originLng, double destLat, double destLng,
        List<(double Lat, double Lng)>? waypoints = null)
    {
        var coords = waypoints?.Select(w => new Coordinate { Latitude = w.Lat, Longitude = w.Lng }).ToList();
        var route = await _osrmService.GetRouteAsync(originLat, originLng, destLat, destLng, coords);
        return route?.Geometry ?? "[]";
    }

    public async Task<List<(double Lat, double Lng, string Address)>> SearchPlacesAsync(string query)
    {
        var results = await _nominatimService.SearchAsync(query, 5);
        return results.Select(r => (r.Latitude, r.Longitude, r.DisplayName)).ToList();
    }
}
