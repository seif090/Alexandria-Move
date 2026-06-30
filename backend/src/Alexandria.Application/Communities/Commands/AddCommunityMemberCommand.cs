using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class AddCommunityMemberCommand : IRequest<Result>
{    public Guid CommunityId { get; set; }
}

public class AddCommunityMemberCommandHandler : IRequestHandler<AddCommunityMemberCommand, Result>
{
    public Task<Result> Handle(AddCommunityMemberCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
