using Alexandria.Application.Analytics.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class AnalyticsController : BaseApiController
{
    private readonly IMediator _mediator;

    public AnalyticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetDashboard([FromQuery] GetDashboardAnalyticsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("community/{communityId:guid}")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> GetCommunityAnalytics(Guid communityId, [FromQuery] GetCommunityAnalyticsQuery query)
    {
        query.CommunityId = communityId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("driver/{driverId:guid}")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin,Driver")]
    public async Task<IActionResult> GetDriverAnalytics(Guid driverId, [FromQuery] GetDriverAnalyticsQuery query)
    {
        query.DriverId = driverId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("trips/summary")]
    public async Task<IActionResult> GetTripsSummary([FromQuery] GetTripsSummaryQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("bookings/summary")]
    public async Task<IActionResult> GetBookingsSummary([FromQuery] GetBookingsSummaryQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("revenue")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> GetRevenueAnalytics([FromQuery] GetRevenueAnalyticsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("users/trends")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetUserTrends([FromQuery] GetUserTrendsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("communities/trends")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetCommunityTrends([FromQuery] GetCommunityTrendsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("routes/popular")]
    public async Task<IActionResult> GetPopularRoutes([FromQuery] GetPopularRoutesQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("peak-hours")]
    public async Task<IActionResult> GetPeakHoursAnalytics([FromQuery] GetPeakHoursAnalyticsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("satisfaction")]
    public async Task<IActionResult> GetSatisfactionAnalytics([FromQuery] GetSatisfactionAnalyticsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
