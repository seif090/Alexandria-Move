using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Booking : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public Guid GroupId { get; set; }
    public virtual TransportationGroup Group { get; set; } = null!;
    public BookingStatus Status { get; set; }
    public DateTime BookingDate { get; set; }
    public Guid? PickupStopId { get; set; }
    public Guid? DropoffStopId { get; set; }
    public int SeatCount { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
    public DateTime BookedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    public PaymentStatus? PaymentStatus { get; set; }
    public bool IsQrScanned { get; set; }
    public string? QrCodeToken { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
