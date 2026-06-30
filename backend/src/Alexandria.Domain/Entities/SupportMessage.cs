namespace Alexandria.Domain.Entities;

public class SupportMessage : BaseEntity
{
    public Guid TicketId { get; set; }
    public virtual SupportTicket Ticket { get; set; } = null!;
    public Guid SenderId { get; set; }
    public virtual User Sender { get; set; } = null!;
    public Guid UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsStaff { get; set; }
    public DateTime SentAt { get; set; }
}
