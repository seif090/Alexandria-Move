using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record SearchStopsQuery : IRequest<Result<object>>;

public class SearchStopsQueryHandler : IRequestHandler<SearchStopsQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchStopsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
