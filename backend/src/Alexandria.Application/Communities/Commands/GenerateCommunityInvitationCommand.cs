using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class GenerateCommunityInvitationCommand : IRequest<Result<object>>
{
    public Guid CommunityId { get; set; }
}