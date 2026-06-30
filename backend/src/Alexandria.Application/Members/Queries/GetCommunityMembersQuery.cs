using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Queries;

public record GetCommunityMembersQuery : IRequest<Result<object>>;

public class GetCommunityMembersQueryHandler : IRequestHandler<GetCommunityMembersQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetCommunityMembersQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
