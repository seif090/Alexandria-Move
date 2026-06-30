namespace Alexandria.Domain.Entities;

public class VehicleDocument : BaseEntity
{
    public Guid VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; } = null!;
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentUrl { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public bool IsVerified { get; set; }
    public DateTime UploadedAt { get; set; }
}
