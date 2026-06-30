using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Ratings.Queries;

public class GetRatingsByEntityQuery : IRequest<Result<object>>
{
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
}

public class GetRatingsByEntityQueryHandler : IRequestHandler<GetRatingsByEntityQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetRatingsByEntityQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
