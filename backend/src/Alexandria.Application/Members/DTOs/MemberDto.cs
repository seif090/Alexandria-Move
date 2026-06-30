using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Members.DTOs;

public class MemberDto : IMapFrom<CommunityMember>
{
    public Guid Id { get; set; }
    public Guid CommunityId { get; set; }
    public string CommunityName { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string? UserProfileImageUrl { get; set; }
    public MemberRole Role { get; set; }
    public MemberStatus Status { get; set; }
    public DateTime JoinedAt { get; set; }
}

public class CreateMemberDto
{
    public Guid CommunityId { get; set; }
    public Guid UserId { get; set; }
    public string? Role { get; set; }
}
