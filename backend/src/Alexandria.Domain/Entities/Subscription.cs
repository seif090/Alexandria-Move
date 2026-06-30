namespace Alexandria.Domain.Entities;

public class Subscription : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public Guid CommunityId { get; set; }
    public virtual Community Community { get; set; } = null!;
    public string PlanName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public bool AutoRenew { get; set; }
}
