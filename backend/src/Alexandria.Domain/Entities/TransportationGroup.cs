using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class TransportationGroup : BaseEntity
{
    public Guid CommunityId { get; set; }
    public virtual Community Community { get; set; } = null!;
    public Guid? RouteId { get; set; }
    public virtual Route? Route { get; set; }
    public Guid? DriverId { get; set; }
    public virtual Driver? Driver { get; set; }
    public Guid? VehicleId { get; set; }
    public virtual Vehicle? Vehicle { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int AvailableSeats { get; set; }
    public TimeSpan DepartureTime { get; set; }
    public TimeSpan? ReturnTime { get; set; }
    public string? WorkingDays { get; set; }
    public decimal Price { get; set; }
    public GroupStatus Status { get; set; }
    public int WaitlistCount { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public TimeSpan? ArrivalTime { get; set; }
    public double? Rating { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public virtual ICollection<Booking> Bookings { get; set; } = new HashSet<Booking>();
    public virtual ICollection<Trip> Trips { get; set; } = new HashSet<Trip>();
}
