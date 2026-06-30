using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class ApproveMemberCommand : IRequest<Result>
{
    public Guid CommunityId { get; set; }
    public Guid UserId { get; set; }

    public Guid Id { get; set; }
}