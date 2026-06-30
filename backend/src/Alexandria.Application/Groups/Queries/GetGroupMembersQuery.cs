using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Groups.Queries;

public class GetGroupMembersQuery : IRequest<Result<object>>
{
    public Guid GroupId { get; set; }
}

public class GetGroupMembersQueryHandler : IRequestHandler<GetGroupMembersQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetGroupMembersQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
