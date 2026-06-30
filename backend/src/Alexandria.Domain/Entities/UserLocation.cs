namespace Alexandria.Domain.Entities;

public class UserLocation : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public Guid? TripId { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Speed { get; set; }
    public double? Heading { get; set; }
    public DateTime Timestamp { get; set; }
}
