using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Queries;

public record GetMyBookingsQuery : IRequest<Result<object>>;

public class GetMyBookingsQueryHandler : IRequestHandler<GetMyBookingsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetMyBookingsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
