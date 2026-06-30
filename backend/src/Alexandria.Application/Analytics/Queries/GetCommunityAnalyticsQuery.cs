using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public class GetCommunityAnalyticsQuery : IRequest<Result<object>>
{
    public Guid CommunityId { get; set; }
}

public class GetCommunityAnalyticsQueryHandler : IRequestHandler<GetCommunityAnalyticsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetCommunityAnalyticsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
