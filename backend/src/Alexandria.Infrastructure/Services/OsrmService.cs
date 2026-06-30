using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using Alexandria.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.Services;

public class OsrmService : IOsrmService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OsrmService> _logger;
    private readonly string _baseUrl;

    public OsrmService(HttpClient httpClient, ILogger<OsrmService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _baseUrl = configuration["OSRM:BaseUrl"] ?? "https://router.project-osrm.org";
    }

    public async Task<OSRMRouteResult?> GetRouteAsync(
        double originLat, double originLng,
        double destLat, double destLng,
        List<Coordinate>? waypoints = null)
    {
        try
        {
            var coords = $"{originLng.ToString(CultureInfo.InvariantCulture)},{originLat.ToString(CultureInfo.InvariantCulture)}";
            if (waypoints?.Count > 0)
                coords += ";" + string.Join(";", waypoints.Select(w =>
                    $"{w.Longitude.ToString(CultureInfo.InvariantCulture)},{w.Latitude.ToString(CultureInfo.InvariantCulture)}"));
            coords += $";{destLng.ToString(CultureInfo.InvariantCulture)},{destLat.ToString(CultureInfo.InvariantCulture)}";

            var url = $"{_baseUrl}/route/v1/driving/{coords}?overview=full&geometries=geojson&steps=true&alternatives=false";
            var response = await _httpClient.GetFromJsonAsync<JsonElement>(url);

            if (!response.TryGetProperty("code", out var code) || code.GetString() != "Ok")
                return null;

            var route = response.GetProperty("routes")[0];
            var distanceKm = route.GetProperty("distance").GetDouble() / 1000.0;
            var durationMinutes = route.GetProperty("duration").GetDouble() / 60.0;
            var geometry = route.GetProperty("geometry").GetRawText();

            var coordinates = new List<Coordinate>();
            var geoCoords = route.GetProperty("geometry").GetProperty("coordinates");
            foreach (var coord in geoCoords.EnumerateArray())
            {
                var lng = coord[0].GetDouble();
                var lat = coord[1].GetDouble();
                coordinates.Add(new Coordinate { Latitude = lat, Longitude = lng });
            }

            var legs = route.GetProperty("legs");
            return new OSRMRouteResult
            {
                Coordinates = coordinates,
                DistanceKm = Math.Round(distanceKm, 2),
                DurationMinutes = Math.Round(durationMinutes, 2),
                Geometry = geometry
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OSRM routing failed for {Origin} -> {Dest}", $"{originLat},{originLng}", $"{destLat},{destLng}");
            return null;
        }
    }

    public async Task<(double DistanceKm, double DurationMinutes)> GetDistanceDurationAsync(
        double originLat, double originLng,
        double destLat, double destLng)
    {
        try
        {
            var url = $"{_baseUrl}/route/v1/driving/{originLng},{originLat};{destLng},{destLat}?overview=false";
            var response = await _httpClient.GetFromJsonAsync<JsonElement>(url);

            if (response.TryGetProperty("code", out var code) && code.GetString() == "Ok")
            {
                var route = response.GetProperty("routes")[0];
                var distKm = route.GetProperty("distance").GetDouble() / 1000.0;
                var durMin = route.GetProperty("duration").GetDouble() / 60.0;
                return (Math.Round(distKm, 2), Math.Round(durMin, 2));
            }

            return FallbackHaversine(originLat, originLng, destLat, destLng);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OSRM distance/duration failed");
            return FallbackHaversine(originLat, originLng, destLat, destLng);
        }
    }

    public async Task<List<Coordinate>> GetRouteGeometryAsync(
        double originLat, double originLng,
        double destLat, double destLng,
        List<Coordinate>? waypoints = null)
    {
        var result = await GetRouteAsync(originLat, originLng, destLat, destLng, waypoints);
        return result?.Coordinates ?? new List<Coordinate>();
    }

    public async Task<NearestRoadResult?> GetNearestRoadAsync(double latitude, double longitude)
    {
        try
        {
            var url = $"{_baseUrl}/nearest/v1/driving/{longitude},{latitude}?number=1";
            var response = await _httpClient.GetFromJsonAsync<JsonElement>(url);

            if (!response.TryGetProperty("code", out var code) || code.GetString() != "Ok")
                return null;

            var waypoint = response.GetProperty("waypoints")[0];
            var loc = waypoint.GetProperty("location");
            return new NearestRoadResult
            {
                Latitude = loc[1].GetDouble(),
                Longitude = loc[0].GetDouble(),
                DistanceMeters = Math.Round(waypoint.GetProperty("distance").GetDouble(), 2)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OSRM nearest road failed");
            return null;
        }
    }

    private (double DistanceKm, double DurationMinutes) FallbackHaversine(
        double lat1, double lon1, double lat2, double lon2)
    {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        var distKm = Math.Round(R * c, 2);
        var durMin = Math.Round(distKm / 40 * 60, 2);
        return (distKm, durMin);
    }
}
