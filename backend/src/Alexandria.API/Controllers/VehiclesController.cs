using Alexandria.Application.Vehicles.Commands;
using Alexandria.Application.Vehicles.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class VehiclesController : BaseApiController
{
    private readonly IMediator _mediator;

    public VehiclesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetVehicles([FromQuery] GetVehiclesQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetVehicle(Guid id)
    {
        var result = await _mediator.Send(new GetVehicleByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateVehicle(Guid id, [FromBody] UpdateVehicleCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteVehicle(Guid id)
    {
        var result = await _mediator.Send(new DeleteVehicleCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateVehicleStatus(Guid id, [FromBody] UpdateVehicleStatusCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id:guid}/documents")]
    public async Task<IActionResult> GetVehicleDocuments(Guid id)
    {
        var result = await _mediator.Send(new GetVehicleDocumentsQuery { VehicleId = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/documents")]
    public async Task<IActionResult> UploadVehicleDocument(Guid id, [FromForm] UploadVehicleDocumentCommand command)
    {
        command.VehicleId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}/documents/{documentId:guid}")]
    public async Task<IActionResult> DeleteVehicleDocument(Guid id, Guid documentId)
    {
        var result = await _mediator.Send(new DeleteVehicleDocumentCommand { VehicleId = id, DocumentId = documentId });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id:guid}/maintenance")]
    public async Task<IActionResult> GetVehicleMaintenance(Guid id, [FromQuery] GetVehicleMaintenanceQuery query)
    {
        query.VehicleId = id;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:guid}/maintenance")]
    public async Task<IActionResult> ScheduleMaintenance(Guid id, [FromBody] ScheduleMaintenanceCommand command)
    {
        command.VehicleId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}/maintenance/{maintenanceId:guid}")]
    public async Task<IActionResult> UpdateMaintenance(Guid id, Guid maintenanceId, [FromBody] UpdateMaintenanceCommand command)
    {
        command.VehicleId = id;
        command.MaintenanceId = maintenanceId;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("by-driver/{driverId:guid}")]
    public async Task<IActionResult> GetVehiclesByDriver(Guid driverId)
    {
        var result = await _mediator.Send(new GetVehiclesByDriverQuery { DriverId = driverId });
        return Ok(result);
    }
}
