using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record SearchUsersQuery : IRequest<Result<object>>;

public class SearchUsersQueryHandler : IRequestHandler<SearchUsersQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
