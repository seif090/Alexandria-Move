using Alexandria.Application.Routes.Commands;
using Alexandria.Application.Routes.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class RoutesController : BaseApiController
{
    private readonly IMediator _mediator;

    public RoutesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoutes([FromQuery] GetRoutesQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetRoute(Guid id)
    {
        var result = await _mediator.Send(new GetRouteByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRoute([FromBody] CreateRouteCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateRoute(Guid id, [FromBody] UpdateRouteCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteRoute(Guid id)
    {
        var result = await _mediator.Send(new DeleteRouteCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id:guid}/distance")]
    public async Task<IActionResult> CalculateDistance(Guid id)
    {
        var result = await _mediator.Send(new CalculateRouteDistanceQuery { RouteId = id });
        return Ok(result);
    }

    [HttpGet("{id:guid}/optimize")]
    public async Task<IActionResult> OptimizeRoute(Guid id)
    {
        var result = await _mediator.Send(new OptimizeRouteCommand { RouteId = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishRoute(Guid id)
    {
        var result = await _mediator.Send(new PublishRouteCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/archive")]
    public async Task<IActionResult> ArchiveRoute(Guid id)
    {
        var result = await _mediator.Send(new ArchiveRouteCommand { Id = id });
        return Ok(result);
    }
}
