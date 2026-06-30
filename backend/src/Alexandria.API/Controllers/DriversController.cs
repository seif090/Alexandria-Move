using Alexandria.Application.Drivers.Commands;
using Alexandria.Application.Drivers.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class DriversController : BaseApiController
{
    private readonly IMediator _mediator;

    public DriversController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetDrivers([FromQuery] GetDriversQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDriver(Guid id)
    {
        var result = await _mediator.Send(new GetDriverByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDriver([FromBody] CreateDriverCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateDriver(Guid id, [FromBody] UpdateDriverCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteDriver(Guid id)
    {
        var result = await _mediator.Send(new DeleteDriverCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/verify")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> VerifyDriver(Guid id)
    {
        var result = await _mediator.Send(new VerifyDriverCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> ApproveDriver(Guid id)
    {
        var result = await _mediator.Send(new ApproveDriverCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> RejectDriver(Guid id, [FromBody] RejectDriverCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/suspend")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> SuspendDriver(Guid id)
    {
        var result = await _mediator.Send(new SuspendDriverCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/activate")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> ActivateDriver(Guid id)
    {
        var result = await _mediator.Send(new ActivateDriverCommand { Id = id });
        return Ok(result);
    }

    [HttpGet("{id:guid}/performance")]
    public async Task<IActionResult> GetDriverPerformance(Guid id, [FromQuery] GetDriverPerformanceQuery query)
    {
        query.DriverId = id;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}/rating")]
    public async Task<IActionResult> GetDriverRating(Guid id)
    {
        var result = await _mediator.Send(new GetDriverRatingQuery { DriverId = id });
        return Ok(result);
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableDrivers([FromQuery] GetAvailableDriversQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:guid}/location")]
    public async Task<IActionResult> UpdateDriverLocation(Guid id, [FromBody] UpdateDriverLocationCommand command)
    {
        command.DriverId = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
