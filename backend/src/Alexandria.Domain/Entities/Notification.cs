using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public NotificationType Type { get; set; }
    public NotificationEvent? Event { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public string? Data { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime SentAt { get; set; }
}
