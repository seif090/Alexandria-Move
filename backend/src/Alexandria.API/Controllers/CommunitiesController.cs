using Alexandria.Application.Communities.Commands;
using Alexandria.Application.Communities.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class CommunitiesController : BaseApiController
{
    private readonly IMediator _mediator;

    public CommunitiesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCommunities([FromQuery] GetCommunitiesQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCommunity(Guid id)
    {
        var result = await _mediator.Send(new GetCommunityByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCommunity([FromBody] CreateCommunityCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCommunity(Guid id, [FromBody] UpdateCommunityCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> DeleteCommunity(Guid id)
    {
        var result = await _mediator.Send(new DeleteCommunityCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> ApproveCommunity(Guid id)
    {
        var result = await _mediator.Send(new ApproveCommunityCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> RejectCommunity(Guid id, [FromBody] RejectCommunityCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("{id:guid}/members")]
    public async Task<IActionResult> GetCommunityMembers(Guid id, [FromQuery] GetCommunityMembersQuery query)
    {
        query.CommunityId = id;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{id:guid}/members")]
    public async Task<IActionResult> AddCommunityMember(Guid id, [FromBody] AddCommunityMemberCommand command)
    {
        command.CommunityId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}/members/{memberId:guid}")]
    public async Task<IActionResult> RemoveCommunityMember(Guid id, Guid memberId)
    {
        var result = await _mediator.Send(new RemoveCommunityMemberCommand { CommunityId = id, MemberId = memberId });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/invitations")]
    public async Task<IActionResult> GenerateInvitation(Guid id)
    {
        var result = await _mediator.Send(new GenerateCommunityInvitationCommand { CommunityId = id });
        return Ok(result);
    }

    [HttpPost("join")]
    public async Task<IActionResult> JoinByInvitation([FromBody] JoinCommunityByInvitationCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
