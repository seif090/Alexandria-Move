using Alexandria.Application.Common.Models;
using Alexandria.Application.Members.DTOs;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class AddMemberCommand : IRequest<Result<MemberDto>>
{
    public Guid CommunityId { get; set; }
    public Guid UserId { get; set; }
    public string? Role { get; set; }
}
