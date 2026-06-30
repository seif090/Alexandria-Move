using Alexandria.Application.Groups.Commands;
using Alexandria.Application.Groups.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class GroupsController : BaseApiController
{
    private readonly IMediator _mediator;

    public GroupsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetGroups([FromQuery] GetGroupsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetGroup(Guid id)
    {
        var result = await _mediator.Send(new GetGroupByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup([FromBody] CreateGroupCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateGroup(Guid id, [FromBody] UpdateGroupCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteGroup(Guid id)
    {
        var result = await _mediator.Send(new DeleteGroupCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/clone")]
    public async Task<IActionResult> CloneGroup(Guid id, [FromBody] CloneGroupCommand command)
    {
        command.SourceGroupId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/assign-users")]
    public async Task<IActionResult> AssignUsers(Guid id, [FromBody] AssignUsersToGroupCommand command)
    {
        command.GroupId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/remove-users")]
    public async Task<IActionResult> RemoveUsers(Guid id, [FromBody] RemoveUsersFromGroupCommand command)
    {
        command.GroupId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("recommendations")]
    public async Task<IActionResult> GetGroupRecommendations([FromQuery] GetGroupRecommendationsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}/members")]
    public async Task<IActionResult> GetGroupMembers(Guid id, [FromQuery] GetGroupMembersQuery query)
    {
        query.GroupId = id;
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
