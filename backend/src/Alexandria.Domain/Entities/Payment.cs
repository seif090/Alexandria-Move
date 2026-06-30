using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public Guid BookingId { get; set; }
    public virtual Booking Booking { get; set; } = null!;
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; }
    public string? TransactionId { get; set; }
    public string? InvoiceNumber { get; set; }
    public string? Currency { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime? RefundedAt { get; set; }
}
