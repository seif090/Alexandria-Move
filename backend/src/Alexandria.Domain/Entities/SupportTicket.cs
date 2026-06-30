using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class SupportTicket : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string Subject { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Message { get; set; }
    public SupportTicketStatus Status { get; set; }
    public SupportTicketPriority Priority { get; set; }
    public Guid? AssignedToId { get; set; }
    public virtual User? AssignedTo { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public virtual ICollection<SupportMessage> Messages { get; set; } = new HashSet<SupportMessage>();
}
