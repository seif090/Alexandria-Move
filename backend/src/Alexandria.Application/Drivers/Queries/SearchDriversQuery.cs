using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Drivers.Queries;

public record SearchDriversQuery : IRequest<Result<object>>;

public class SearchDriversQueryHandler : IRequestHandler<SearchDriversQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchDriversQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
