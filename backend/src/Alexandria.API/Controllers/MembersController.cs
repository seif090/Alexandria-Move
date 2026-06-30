using Alexandria.Application.Members.Commands;
using Alexandria.Application.Members.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class MembersController : BaseApiController
{
    private readonly IMediator _mediator;

    public MembersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMembers([FromQuery] GetMembersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMember(Guid id)
    {
        var result = await _mediator.Send(new GetMemberByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMember([FromBody] CreateMemberCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateMember(Guid id, [FromBody] UpdateMemberCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteMember(Guid id)
    {
        var result = await _mediator.Send(new DeleteMemberCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> BulkCreateMembers([FromBody] BulkCreateMembersCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("bulk/delete")]
    public async Task<IActionResult> BulkDeleteMembers([FromBody] BulkDeleteMembersCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> ApproveMember(Guid id)
    {
        var result = await _mediator.Send(new ApproveMemberCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> RejectMember(Guid id)
    {
        var result = await _mediator.Send(new RejectMemberCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/suspend")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> SuspendMember(Guid id)
    {
        var result = await _mediator.Send(new SuspendMemberCommand { Id = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/reinstate")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> ReinstateMember(Guid id)
    {
        var result = await _mediator.Send(new ReinstateMemberCommand { Id = id });
        return Ok(result);
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportMembers([FromQuery] ExportMembersQuery query)
    {
        var result = await _mediator.Send(query);
        return File(result, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "members.xlsx");
    }

    [HttpPost("import")]
    public async Task<IActionResult> ImportMembers(IFormFile file)
    {
        var result = await _mediator.Send(new ImportMembersCommand { File = file });
        return Ok(result);
    }
}
