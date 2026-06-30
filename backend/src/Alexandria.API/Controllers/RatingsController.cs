using Alexandria.Application.Ratings.Commands;
using Alexandria.Application.Ratings.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class RatingsController : BaseApiController
{
    private readonly IMediator _mediator;

    public RatingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetRatings([FromQuery] GetRatingsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetRating(Guid id)
    {
        var result = await _mediator.Send(new GetRatingByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRating([FromBody] CreateRatingCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateRating(Guid id, [FromBody] UpdateRatingCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteRating(Guid id)
    {
        var result = await _mediator.Send(new DeleteRatingCommand { Id = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("average/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetAverageRating(string entityType, Guid entityId)
    {
        var result = await _mediator.Send(new GetAverageRatingQuery { EntityType = entityType, EntityId = entityId });
        return Ok(result);
    }

    [HttpGet("by-entity/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetRatingsByEntity(string entityType, Guid entityId, [FromQuery] GetRatingsByEntityQuery query)
    {
        query.EntityType = entityType;
        query.EntityId = entityId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("summary/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetRatingSummary(string entityType, Guid entityId)
    {
        var result = await _mediator.Send(new GetRatingSummaryQuery { EntityType = entityType, EntityId = entityId });
        return Ok(result);
    }
}
