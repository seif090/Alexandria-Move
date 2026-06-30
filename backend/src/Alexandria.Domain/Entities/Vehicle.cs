using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Vehicle : BaseEntity
{
    public string PlateNumber { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Capacity { get; set; }
    public string? Color { get; set; }
    public string? InsuranceNumber { get; set; }
    public DateTime? InsuranceExpiryDate { get; set; }
    public bool IsVerified { get; set; }
    public VehicleStatus Status { get; set; }
    public Guid OwnerId { get; set; }
    public virtual User Owner { get; set; } = null!;
    public Guid DriverId { get; set; }
    public virtual Driver? Driver { get; set; }
    public VehicleType Type { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public virtual ICollection<VehicleDocument> Documents { get; set; } = new HashSet<VehicleDocument>();
    public virtual ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new HashSet<MaintenanceRecord>();
    public virtual ICollection<TransportationGroup> Groups { get; set; } = new HashSet<TransportationGroup>();
}
