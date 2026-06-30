namespace Alexandria.Domain.Entities;

public class UserDevice : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string DeviceName { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty;
    public string DeviceToken { get; set; } = string.Empty;
    public DateTime? LastUsedAt { get; set; }
    public bool IsActive { get; set; }
}
