using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class CommunityMember : BaseEntity
{
    public Guid CommunityId { get; set; }
    public virtual Community Community { get; set; } = null!;
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public MemberStatus Status { get; set; }
    public DateTime JoinedAt { get; set; }
    public MemberRole Role { get; set; }
    public string? Notes { get; set; }
    public bool IsGroupAdmin { get; set; }
}
