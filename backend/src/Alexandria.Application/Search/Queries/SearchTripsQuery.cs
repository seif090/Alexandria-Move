using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record SearchTripsQuery : IRequest<Result<object>>;

public class SearchTripsQueryHandler : IRequestHandler<SearchTripsQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchTripsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
