namespace Alexandria.Domain.Entities;

public class TripPassenger : BaseEntity
{
    public Guid TripId { get; set; }
    public virtual Trip Trip { get; set; } = null!;
    public Guid BookingId { get; set; }
    public virtual Booking Booking { get; set; } = null!;
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public bool IsPickedUp { get; set; }
    public bool IsDroppedOff { get; set; }
    public DateTime? PickedUpAt { get; set; }
    public DateTime? DroppedOffAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
}
