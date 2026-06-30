namespace Alexandria.Application.Common.Interfaces;

public interface IMapService
{
    Task<(double Distance, double Duration)> CalculateDistanceAsync(double originLat, double originLng, double destLat, double destLng);
    Task<string> GetDirectionsAsync(double originLat, double originLng, double destLat, double destLng, List<(double Lat, double Lng)>? waypoints = null);
    Task<List<(double Lat, double Lng, string Address)>> SearchPlacesAsync(string query);
}
