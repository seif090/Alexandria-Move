using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Files.Queries;

public record GetFilesQuery : IRequest<Result<object>>;

public class GetFilesQueryHandler : IRequestHandler<GetFilesQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetFilesQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
