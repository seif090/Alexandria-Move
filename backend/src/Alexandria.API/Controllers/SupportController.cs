using Alexandria.Application.Support.Commands;
using Alexandria.Application.Support.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class SupportController : BaseApiController
{
    private readonly IMediator _mediator;

    public SupportController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("tickets")]
    public async Task<IActionResult> GetTickets([FromQuery] GetSupportTicketsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("tickets/{id:guid}")]
    public async Task<IActionResult> GetTicket(Guid id)
    {
        var result = await _mediator.Send(new GetSupportTicketByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost("tickets")]
    public async Task<IActionResult> CreateTicket([FromBody] CreateSupportTicketCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("tickets/{id:guid}")]
    public async Task<IActionResult> UpdateTicket(Guid id, [FromBody] UpdateSupportTicketCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("tickets/{id:guid}/status")]
    public async Task<IActionResult> UpdateTicketStatus(Guid id, [FromBody] UpdateTicketStatusCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("tickets/{id:guid}/assign")]
    [Authorize(Roles = "SuperAdmin,SupportAgent")]
    public async Task<IActionResult> AssignTicket(Guid id, [FromBody] AssignSupportTicketCommand command)
    {
        command.TicketId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("tickets/{id:guid}/messages")]
    public async Task<IActionResult> GetTicketMessages(Guid id)
    {
        var result = await _mediator.Send(new GetTicketMessagesQuery { TicketId = id });
        return Ok(result);
    }

    [HttpPost("tickets/{id:guid}/messages")]
    public async Task<IActionResult> SendMessage(Guid id, [FromBody] SendTicketMessageCommand command)
    {
        command.TicketId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("tickets/{id:guid}/close")]
    public async Task<IActionResult> CloseTicket(Guid id)
    {
        var result = await _mediator.Send(new CloseSupportTicketCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("tickets/{id:guid}/reopen")]
    public async Task<IActionResult> ReopenTicket(Guid id)
    {
        var result = await _mediator.Send(new ReopenSupportTicketCommand { Id = id });
        return Ok(result);
    }

    [HttpGet("tickets/my")]
    public async Task<IActionResult> GetMyTickets([FromQuery] GetMySupportTicketsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
