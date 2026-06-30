using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetBookingsSummaryQuery : IRequest<Result<object>>;

public class GetBookingsSummaryQueryHandler : IRequestHandler<GetBookingsSummaryQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetBookingsSummaryQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
