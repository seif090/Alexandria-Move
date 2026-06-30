using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using Alexandria.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.Services;

public class NominatimService : INominatimService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<NominatimService> _logger;
    private readonly string _baseUrl;

    public NominatimService(HttpClient httpClient, ILogger<NominatimService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _baseUrl = configuration["Nominatim:BaseUrl"] ?? "https://nominatim.openstreetmap.org";
        _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "AlexandriaMobility/1.0");
    }

    public async Task<List<GeocodingResult>> SearchAsync(string query, int limit = 5)
    {
        try
        {
            var encoded = Uri.EscapeDataString(query);
            var url = $"{_baseUrl}/search?q={encoded}&format=json&addressdetails=1&limit={limit}";
            var results = await _httpClient.GetFromJsonAsync<JsonElement>(url);

            var geocodingResults = new List<GeocodingResult>();
            foreach (var item in results.EnumerateArray())
            {
                geocodingResults.Add(ParseGeocodingResult(item));
            }
            return geocodingResults;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Nominatim search failed for {Query}", query);
            return new List<GeocodingResult>();
        }
    }

    public async Task<GeocodingResult?> ReverseGeocodeAsync(double latitude, double longitude)
    {
        try
        {
            var lat = latitude.ToString(CultureInfo.InvariantCulture);
            var lng = longitude.ToString(CultureInfo.InvariantCulture);
            var url = $"{_baseUrl}/reverse?lat={lat}&lon={lng}&format=json&addressdetails=1";
            var result = await _httpClient.GetFromJsonAsync<JsonElement>(url);

            if (!result.TryGetProperty("lat", out _))
                return null;

            return ParseGeocodingResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Nominatim reverse geocode failed for {Lat},{Lng}", latitude, longitude);
            return null;
        }
    }

    public async Task<List<GeocodingResult>> SearchInAreaAsync(string query, double centerLat, double centerLng, int limit = 5)
    {
        try
        {
            var encoded = Uri.EscapeDataString(query);
            var lat = centerLat.ToString(CultureInfo.InvariantCulture);
            var lng = centerLng.ToString(CultureInfo.InvariantCulture);
            var url = $"{_baseUrl}/search?q={encoded}&format=json&addressdetails=1&limit={limit}&viewbox={lng},{lat},{lng},{lat}&bounded=1";
            var results = await _httpClient.GetFromJsonAsync<JsonElement>(url);

            var geocodingResults = new List<GeocodingResult>();
            foreach (var item in results.EnumerateArray())
            {
                geocodingResults.Add(ParseGeocodingResult(item));
            }
            return geocodingResults;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Nominatim area search failed for {Query} near {Lat},{Lng}", query, centerLat, centerLng);
            return new List<GeocodingResult>();
        }
    }

    private GeocodingResult ParseGeocodingResult(JsonElement item)
    {
        var address = item.TryGetProperty("address", out var addr) ? addr : default;

        return new GeocodingResult
        {
            Latitude = double.Parse(item.GetProperty("lat").GetString()!, CultureInfo.InvariantCulture),
            Longitude = double.Parse(item.GetProperty("lon").GetString()!, CultureInfo.InvariantCulture),
            DisplayName = item.GetProperty("display_name").GetString() ?? string.Empty,
            Street = GetAddressComponent(addr, "road") ?? GetAddressComponent(addr, "pedestrian") ?? string.Empty,
            City = GetAddressComponent(addr, "city") ?? GetAddressComponent(addr, "town") ?? GetAddressComponent(addr, "village") ?? string.Empty,
            Area = GetAddressComponent(addr, "suburb") ?? GetAddressComponent(addr, "district") ?? string.Empty,
            Country = GetAddressComponent(addr, "country") ?? string.Empty,
            Type = item.TryGetProperty("type", out var t) ? t.GetString() ?? "unknown" : "unknown"
        };
    }

    private string? GetAddressComponent(JsonElement address, string key)
    {
        if (address.ValueKind != JsonValueKind.Undefined && address.TryGetProperty(key, out var value))
            return value.GetString();
        return null;
    }
}
