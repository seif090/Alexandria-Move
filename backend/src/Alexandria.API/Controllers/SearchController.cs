using Alexandria.Application.Search.Commands;
using Alexandria.Application.Search.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class SearchController : BaseApiController
{
    private readonly IMediator _mediator;

    public SearchController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("global")]
    public async Task<IActionResult> GlobalSearch([FromQuery] GlobalSearchQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("users")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> SearchUsers([FromQuery] SearchUsersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("communities")]
    public async Task<IActionResult> SearchCommunities([FromQuery] SearchCommunitiesQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("routes")]
    public async Task<IActionResult> SearchRoutes([FromQuery] SearchRoutesQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("stops")]
    public async Task<IActionResult> SearchStops([FromQuery] SearchStopsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("drivers")]
    public async Task<IActionResult> SearchDrivers([FromQuery] SearchDriversQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> SearchBookings([FromQuery] SearchBookingsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("trips")]
    public async Task<IActionResult> SearchTrips([FromQuery] SearchTripsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("tickets")]
    public async Task<IActionResult> SearchSupportTickets([FromQuery] SearchSupportTicketsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("suggestions")]
    public async Task<IActionResult> GetSearchSuggestions([FromQuery] GetSearchSuggestionsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("reindex")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> ReindexSearch()
    {
        var result = await _mediator.Send(new ReindexSearchCommand());
        return Ok(result);
    }
}
