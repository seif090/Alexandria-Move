using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Drivers.Queries;

public record GetAvailableDriversQuery : IRequest<Result<object>>;

public class GetAvailableDriversQueryHandler : IRequestHandler<GetAvailableDriversQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetAvailableDriversQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
