using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;

namespace Alexandria.Application.Notifications.DTOs;

public class NotificationDto : IMapFrom<Notification>
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? Type { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }
}
