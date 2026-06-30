using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class RemoveCommunityMemberCommand : IRequest<Result>
{
    public Guid CommunityId { get; set; }
    public Guid MemberId { get; set; }
}