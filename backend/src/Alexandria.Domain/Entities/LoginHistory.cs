namespace Alexandria.Domain.Entities;

public class LoginHistory : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? DeviceInfo { get; set; }
    public DateTime LoginAt { get; set; }
    public bool IsSuccessful { get; set; }
    public string? FailureReason { get; set; }
}
