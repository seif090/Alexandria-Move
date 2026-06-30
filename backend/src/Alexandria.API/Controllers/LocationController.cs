using Alexandria.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
[ApiController]
[Route("api/location")]
public class LocationController : BaseApiController
{
    private readonly ILocationTrackingService _trackingService;
    private readonly IOsrmService _osrmService;
    private readonly INominatimService _nominatimService;

    public LocationController(
        ILocationTrackingService trackingService,
        IOsrmService osrmService,
        INominatimService nominatimService)
    {
        _trackingService = trackingService;
        _osrmService = osrmService;
        _nominatimService = nominatimService;
    }

    [HttpGet("driver/{driverId:guid}/latest")]
    public async Task<IActionResult> GetDriverLatestLocation(Guid driverId)
    {
        var location = await _trackingService.GetLatestDriverLocationAsync(driverId);
        if (location == null)
            return NotFound(new { message = "No location data found for this driver" });
        return Ok(new { data = location });
    }

    [HttpGet("trip/{tripId:guid}/history")]
    public async Task<IActionResult> GetTripLocationHistory(Guid tripId)
    {
        var history = await _trackingService.GetTripLocationHistoryAsync(tripId);
        return Ok(new { data = history });
    }

    [HttpGet("trip/{tripId:guid}/analysis")]
    public async Task<IActionResult> GetTripLocationAnalysis(Guid tripId)
    {
        var analysis = await _trackingService.GetTripLocationAnalysisAsync(tripId);
        return Ok(new { data = analysis });
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> GetActiveDriversNearby(
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        [FromQuery] double radiusKm = 5)
    {
        var drivers = await _trackingService.GetActiveDriversNearbyAsync(latitude, longitude, radiusKm);
        return Ok(new { data = drivers });
    }

    [HttpGet("route")]
    public async Task<IActionResult> GetRoute(
        [FromQuery] double originLat, [FromQuery] double originLng,
        [FromQuery] double destLat, [FromQuery] double destLng)
    {
        var route = await _osrmService.GetRouteAsync(originLat, originLng, destLat, destLng);
        if (route == null)
            return BadRequest(new { message = "Could not calculate route" });
        return Ok(new { data = route });
    }

    [HttpGet("geocode/search")]
    public async Task<IActionResult> SearchPlaces([FromQuery] string q, [FromQuery] int limit = 5)
    {
        var results = await _nominatimService.SearchAsync(q, limit);
        return Ok(new { data = results });
    }

    [HttpGet("geocode/reverse")]
    public async Task<IActionResult> ReverseGeocode([FromQuery] double lat, [FromQuery] double lng)
    {
        var result = await _nominatimService.ReverseGeocodeAsync(lat, lng);
        if (result == null)
            return NotFound(new { message = "No address found for these coordinates" });
        return Ok(new { data = result });
    }

    [HttpGet("distance")]
    public async Task<IActionResult> CalculateDistance(
        [FromQuery] double originLat, [FromQuery] double originLng,
        [FromQuery] double destLat, [FromQuery] double destLng)
    {
        var (distanceKm, durationMinutes) = await _osrmService.GetDistanceDurationAsync(originLat, originLng, destLat, destLng);
        return Ok(new { data = new { distanceKm, durationMinutes } });
    }
}
