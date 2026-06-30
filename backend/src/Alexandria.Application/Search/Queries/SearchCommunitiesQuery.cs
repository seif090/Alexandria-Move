using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record SearchCommunitiesQuery : IRequest<Result<object>>;

public class SearchCommunitiesQueryHandler : IRequestHandler<SearchCommunitiesQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchCommunitiesQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
