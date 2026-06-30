using Alexandria.Application.Notifications.Commands;
using Alexandria.Application.Notifications.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class NotificationsController : BaseApiController
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] GetNotificationsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetNotification(Guid id)
    {
        var result = await _mediator.Send(new GetNotificationByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> SendNotification([FromBody] SendNotificationCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var result = await _mediator.Send(new MarkNotificationReadCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var result = await _mediator.Send(new MarkAllNotificationsReadCommand());
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteNotification(Guid id)
    {
        var result = await _mediator.Send(new DeleteNotificationCommand { Id = id });
        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var result = await _mediator.Send(new GetUnreadNotificationCountQuery());
        return Ok(result);
    }
}
