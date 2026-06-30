using Alexandria.Application.Files.Commands;
using Alexandria.Application.Files.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class FilesController : BaseApiController
{
    private readonly IMediator _mediator;

    public FilesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile([FromForm] UploadFileCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("upload/multiple")]
    public async Task<IActionResult> UploadMultipleFiles([FromForm] UploadMultipleFilesCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetFileInfo(Guid id)
    {
        var result = await _mediator.Send(new GetFileByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> DownloadFile(Guid id)
    {
        var result = await _mediator.Send(new DownloadFileQuery { Id = id });
        if (result == null) return NotFound(new { message = "File not found" });
        return File(result.Content, result.ContentType, result.FileName);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteFile(Guid id)
    {
        var result = await _mediator.Send(new DeleteFileCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("by-entity/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetFilesByEntity(string entityType, Guid entityId)
    {
        var result = await _mediator.Send(new GetFilesByEntityQuery { EntityType = entityType, EntityId = entityId });
        return Ok(result);
    }

    [HttpPut("{id:guid}/metadata")]
    public async Task<IActionResult> UpdateFileMetadata(Guid id, [FromBody] UpdateFileMetadataCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }
}
