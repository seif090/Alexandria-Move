namespace Alexandria.Domain.Entities;

public class DriverDocument : BaseEntity
{
    public Guid DriverId { get; set; }
    public virtual Driver Driver { get; set; } = null!;
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentUrl { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public bool IsVerified { get; set; }
    public DateTime UploadedAt { get; set; }
    public DateTime? VerifiedAt { get; set; }
}
