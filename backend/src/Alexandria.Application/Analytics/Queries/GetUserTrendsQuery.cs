using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Analytics.Queries;

public record GetUserTrendsQuery : IRequest<Result<object>>;

public class GetUserTrendsQueryHandler : IRequestHandler<GetUserTrendsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetUserTrendsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
