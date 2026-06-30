using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record GlobalSearchQuery : IRequest<Result<object>>;

public class GlobalSearchQueryHandler : IRequestHandler<GlobalSearchQuery, Result<object>>
{
    public Task<Result<object>> Handle(GlobalSearchQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
