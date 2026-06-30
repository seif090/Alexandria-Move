using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Queries;

public record GetSearchSuggestionsQuery : IRequest<Result<object>>;

public class GetSearchSuggestionsQueryHandler : IRequestHandler<GetSearchSuggestionsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetSearchSuggestionsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
