using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Ratings.Queries;

public class GetRatingSummaryQuery : IRequest<Result<object>>
{
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
}