using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetSatisfactionAnalyticsQuery : IRequest<Result<object>>;

public class GetSatisfactionAnalyticsQueryHandler : IRequestHandler<GetSatisfactionAnalyticsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetSatisfactionAnalyticsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
