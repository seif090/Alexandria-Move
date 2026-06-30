namespace Alexandria.Application.Common.Interfaces;

public class GeocodingResult
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}

public interface INominatimService
{
    Task<List<GeocodingResult>> SearchAsync(string query, int limit = 5);
    Task<GeocodingResult?> ReverseGeocodeAsync(double latitude, double longitude);
    Task<List<GeocodingResult>> SearchInAreaAsync(string query, double centerLat, double centerLng, int limit = 5);
}
