using Alexandria.Application.Audit.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize(Roles = "SuperAdmin")]
public class AuditController : BaseApiController
{
    private readonly IMediator _mediator;

    public AuditController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuditLogs([FromQuery] GetAuditLogsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetAuditLog(Guid id)
    {
        var result = await _mediator.Send(new GetAuditLogByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpGet("by-entity/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetAuditLogsByEntity(string entityType, Guid entityId, [FromQuery] GetAuditLogsByEntityQuery query)
    {
        query.EntityType = entityType;
        query.EntityId = entityId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("by-user/{userId:guid}")]
    public async Task<IActionResult> GetAuditLogsByUser(Guid userId, [FromQuery] GetAuditLogsByUserQuery query)
    {
        query.UserId = userId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetAuditSummary([FromQuery] GetAuditSummaryQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportAuditLogs([FromQuery] ExportAuditLogsQuery query)
    {
        var result = await _mediator.Send(query);
        return File(result, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "audit-logs.xlsx");
    }
}
