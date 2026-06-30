using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetPeakHoursAnalyticsQuery : IRequest<Result<object>>;

public class GetPeakHoursAnalyticsQueryHandler : IRequestHandler<GetPeakHoursAnalyticsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetPeakHoursAnalyticsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
