namespace Alexandria.Domain.Entities;

public class CommunityInvitation : BaseEntity
{
    public Guid CommunityId { get; set; }
    public virtual Community Community { get; set; } = null!;
    public string? InvitedEmail { get; set; }
    public string? Email { get; set; }
    public string? InvitedPhone { get; set; }
    public int MaxUses { get; set; }
    public int UsedCount { get; set; }
    public string InvitationType { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
    public DateTime? UsedAt { get; set; }
    public Guid CreatedById { get; set; }
}
