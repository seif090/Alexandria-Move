using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetCommunityTrendsQuery : IRequest<Result<object>>;

public class GetCommunityTrendsQueryHandler : IRequestHandler<GetCommunityTrendsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetCommunityTrendsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
