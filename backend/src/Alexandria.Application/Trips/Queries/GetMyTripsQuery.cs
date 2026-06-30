using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Queries;

public record GetMyTripsQuery : IRequest<Result<object>>;

public class GetMyTripsQueryHandler : IRequestHandler<GetMyTripsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetMyTripsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
