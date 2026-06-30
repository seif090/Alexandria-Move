using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Queries;

public record SearchBookingsQuery : IRequest<Result<object>>;

public class SearchBookingsQueryHandler : IRequestHandler<SearchBookingsQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchBookingsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
