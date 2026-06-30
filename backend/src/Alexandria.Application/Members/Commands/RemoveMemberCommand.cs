using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class RemoveMemberCommand : IRequest<Result>
{
    public Guid CommunityId { get; set; }
    public Guid UserId { get; set; }
}
