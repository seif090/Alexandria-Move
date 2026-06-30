using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Trip : BaseEntity
{
    public Guid GroupId { get; set; }
    public virtual TransportationGroup Group { get; set; } = null!;
    public Guid? DriverId { get; set; }
    public virtual Driver? Driver { get; set; }
    public Guid? VehicleId { get; set; }
    public TripStatus Status { get; set; }
    public DateTime ScheduledDate { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? ArrivedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public int? StartOdometer { get; set; }
    public int? EndOdometer { get; set; }
    public string? RouteJson { get; set; }
    public string? Notes { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public virtual ICollection<TripPassenger> PassengerConfirmations { get; set; } = new HashSet<TripPassenger>();
}
