using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Rating : BaseEntity
{
    public Guid RaterId { get; set; }
    public virtual User Rater { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public Guid RatedEntityId { get; set; }
    public RatingEntityType RatedEntityType { get; set; }
    public int Score { get; set; }
    public string? ReviewText { get; set; }
    public RatingEntityType EntityType { get; set; }
    public Guid EntityId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? DriverId { get; set; }
    public Guid? TripId { get; set; }
    public string? Comment { get; set; }
}
