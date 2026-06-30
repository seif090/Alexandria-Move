using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public record JoinCommunityByInvitationCommand : IRequest<Result>;

public class JoinCommunityByInvitationCommandHandler : IRequestHandler<JoinCommunityByInvitationCommand, Result>
{
    public Task<Result> Handle(JoinCommunityByInvitationCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
