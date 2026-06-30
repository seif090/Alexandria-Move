using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetDashboardAnalyticsQuery : IRequest<Result<object>>;

public class GetDashboardAnalyticsQueryHandler : IRequestHandler<GetDashboardAnalyticsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetDashboardAnalyticsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
