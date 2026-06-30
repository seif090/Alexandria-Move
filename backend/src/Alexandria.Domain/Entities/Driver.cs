using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Driver : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
    public string? LicenseImageUrl { get; set; }
    public int? YearsOfExperience { get; set; }
    public double? Rating { get; set; }
    public int TotalTrips { get; set; }
    public double? CancellationRate { get; set; }
    public double? SafetyScore { get; set; }
    public bool IsVerified { get; set; }
    public bool IsAvailable { get; set; }
    public DriverStatus? Status { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public virtual ICollection<DriverDocument> Documents { get; set; } = new HashSet<DriverDocument>();
    public virtual ICollection<TransportationGroup> Groups { get; set; } = new HashSet<TransportationGroup>();
    public virtual ICollection<Trip> Trips { get; set; } = new HashSet<Trip>();
}
