namespace Alexandria.Domain.Entities;

public class MaintenanceRecord : BaseEntity
{
    public Guid VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime MaintenanceDate { get; set; }
    public int? Mileage { get; set; }
    public decimal? Cost { get; set; }
    public string? ServiceProvider { get; set; }
    public DateTime? NextMaintenanceDate { get; set; }
}
