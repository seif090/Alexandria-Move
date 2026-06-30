using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetRevenueAnalyticsQuery : IRequest<Result<object>>;

public class GetRevenueAnalyticsQueryHandler : IRequestHandler<GetRevenueAnalyticsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetRevenueAnalyticsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
