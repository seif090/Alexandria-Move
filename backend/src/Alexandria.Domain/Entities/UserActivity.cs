namespace Alexandria.Domain.Entities;

public class UserActivity : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string ActivityType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IpAddress { get; set; }
    public DateTime Timestamp { get; set; }
}
