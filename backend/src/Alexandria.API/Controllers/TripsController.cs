using Alexandria.Application.Trips.Commands;
using Alexandria.Application.Trips.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class TripsController : BaseApiController
{
    private readonly IMediator _mediator;

    public TripsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetTrips([FromQuery] GetTripsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTrip(Guid id)
    {
        var result = await _mediator.Send(new GetTripByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTrip(Guid id, [FromBody] UpdateTripCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTrip(Guid id)
    {
        var result = await _mediator.Send(new DeleteTripCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/start")]
    public async Task<IActionResult> StartTrip(Guid id)
    {
        var result = await _mediator.Send(new StartTripCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<IActionResult> CompleteTrip(Guid id)
    {
        var result = await _mediator.Send(new CompleteTripCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelTrip(Guid id, [FromBody] CancelTripCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/confirm-passenger/{passengerId:guid}")]
    public async Task<IActionResult> ConfirmPassenger(Guid id, Guid passengerId)
    {
        var result = await _mediator.Send(new ConfirmPassengerCommand { TripId = id, PassengerId = passengerId });
        return Ok(result);
    }

    [HttpPost("{id:guid}/mark-no-show/{passengerId:guid}")]
    public async Task<IActionResult> MarkPassengerNoShow(Guid id, Guid passengerId)
    {
        var result = await _mediator.Send(new MarkPassengerNoShowCommand { TripId = id, PassengerId = passengerId });
        return Ok(result);
    }

    [HttpPost("{id:guid}/add-passenger")]
    public async Task<IActionResult> AddPassenger(Guid id, [FromBody] AddPassengerToTripCommand command)
    {
        command.TripId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/remove-passenger/{passengerId:guid}")]
    public async Task<IActionResult> RemovePassenger(Guid id, Guid passengerId)
    {
        var result = await _mediator.Send(new RemovePassengerFromTripCommand { TripId = id, PassengerId = passengerId });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id:guid}/passengers")]
    public async Task<IActionResult> GetTripPassengers(Guid id)
    {
        var result = await _mediator.Send(new GetTripPassengersQuery { TripId = id });
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveTrips([FromQuery] GetActiveTripsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyTrips([FromQuery] GetMyTripsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:guid}/delay")]
    public async Task<IActionResult> ReportDelay(Guid id, [FromBody] ReportTripDelayCommand command)
    {
        command.TripId = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/locations")]
    public async Task<IActionResult> UpdateTripLocation(Guid id, [FromBody] UpdateTripLocationCommand command)
    {
        command.TripId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
