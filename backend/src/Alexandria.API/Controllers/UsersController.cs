using Alexandria.Application.Users.Commands;
using Alexandria.Application.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize(Roles = "SuperAdmin")]
public class UsersController : BaseApiController
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var result = await _mediator.Send(new GetUserByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/activate")]
    public async Task<IActionResult> ActivateUser(Guid id)
    {
        var result = await _mediator.Send(new ActivateUserCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/deactivate")]
    public async Task<IActionResult> DeactivateUser(Guid id)
    {
        var result = await _mediator.Send(new DeactivateUserCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/verify")]
    public async Task<IActionResult> VerifyUser(Guid id)
    {
        var result = await _mediator.Send(new VerifyUserCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/lock")]
    public async Task<IActionResult> LockUser(Guid id, [FromBody] LockUserCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{id:guid}/unlock")]
    public async Task<IActionResult> UnlockUser(Guid id)
    {
        var result = await _mediator.Send(new UnlockUserCommand { Id = id });
        return Ok(result);
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportUsers([FromQuery] ExportUsersQuery query)
    {
        var result = await _mediator.Send(query);
        return File(result, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "users.xlsx");
    }
}
