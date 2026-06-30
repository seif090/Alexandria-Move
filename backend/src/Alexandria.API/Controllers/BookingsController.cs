using Alexandria.Application.Bookings.Commands;
using Alexandria.Application.Bookings.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class BookingsController : BaseApiController
{
    private readonly IMediator _mediator;

    public BookingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookings([FromQuery] GetBookingsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBooking(Guid id)
    {
        var result = await _mediator.Send(new GetBookingByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateBooking(Guid id, [FromBody] UpdateBookingCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteBooking(Guid id)
    {
        var result = await _mediator.Send(new DeleteBookingCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin,Driver")]
    public async Task<IActionResult> ApproveBooking(Guid id)
    {
        var result = await _mediator.Send(new ApproveBookingCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin,Driver")]
    public async Task<IActionResult> RejectBooking(Guid id, [FromBody] RejectBookingCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id, [FromBody] CancelBookingCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmBooking(Guid id)
    {
        var result = await _mediator.Send(new ConfirmBookingCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> BulkCreateBookings([FromBody] BulkCreateBookingsCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings([FromQuery] GetMyBookingsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}/history")]
    public async Task<IActionResult> GetBookingHistory(Guid id)
    {
        var result = await _mediator.Send(new GetBookingHistoryQuery { BookingId = id });
        return Ok(result);
    }
}
