using Alexandria.Application.Stops.Commands;
using Alexandria.Application.Stops.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class StopsController : BaseApiController
{
    private readonly IMediator _mediator;

    public StopsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetStops([FromQuery] GetStopsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetStop(Guid id)
    {
        var result = await _mediator.Send(new GetStopByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateStop([FromBody] CreateStopCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateStop(Guid id, [FromBody] UpdateStopCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteStop(Guid id)
    {
        var result = await _mediator.Send(new DeleteStopCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/reorder")]
    public async Task<IActionResult> ReorderStop(Guid id, [FromBody] ReorderStopCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("batch-reorder")]
    public async Task<IActionResult> BatchReorderStops([FromBody] BatchReorderStopsCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("by-route/{routeId:guid}")]
    public async Task<IActionResult> GetStopsByRoute(Guid routeId)
    {
        var result = await _mediator.Send(new GetStopsByRouteQuery { RouteId = routeId });
        return Ok(result);
    }
}
