using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetTripsSummaryQuery : IRequest<Result<object>>;

public class GetTripsSummaryQueryHandler : IRequestHandler<GetTripsSummaryQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetTripsSummaryQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
