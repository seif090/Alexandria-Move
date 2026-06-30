using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record SearchSupportTicketsQuery : IRequest<Result<object>>;

public class SearchSupportTicketsQueryHandler : IRequestHandler<SearchSupportTicketsQuery, Result<object>>
{
    public Task<Result<object>> Handle(SearchSupportTicketsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
