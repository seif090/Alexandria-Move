using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetPopularRoutesQuery : IRequest<Result<object>>;

public class GetPopularRoutesQueryHandler : IRequestHandler<GetPopularRoutesQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetPopularRoutesQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
