using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public class GetDriverAnalyticsQuery : IRequest<Result<object>>
{
    public Guid DriverId { get; set; }
}

public class GetDriverAnalyticsQueryHandler : IRequestHandler<GetDriverAnalyticsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetDriverAnalyticsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
