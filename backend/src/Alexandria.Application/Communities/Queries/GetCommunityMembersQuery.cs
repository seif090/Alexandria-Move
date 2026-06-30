using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Queries;

public class GetCommunityMembersQuery : IRequest<Result<object>>
{
    public Guid CommunityId { get; set; }
}

public class GetCommunityMembersQueryHandler : IRequestHandler<GetCommunityMembersQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetCommunityMembersQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
