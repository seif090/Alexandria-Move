using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record SearchRoutesQuery : IRequest<Result<object>>;

public class SearchRoutesQueryHandler : IRequestHandler<SearchRoutesQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchRoutesQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
