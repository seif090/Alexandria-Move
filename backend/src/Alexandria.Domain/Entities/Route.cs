using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Route : BaseEntity
{
    public Guid CommunityId { get; set; }
    public virtual Community Community { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string StartLocation { get; set; } = string.Empty;
    public string EndLocation { get; set; } = string.Empty;
    public double StartLatitude { get; set; }
    public double StartLongitude { get; set; }
    public double EndLatitude { get; set; }
    public double EndLongitude { get; set; }
    public double Distance { get; set; }
    public double? EstimatedTime { get; set; }
    public GroupStatus? Status { get; set; }
    public string? RouteCoordinates { get; set; }
    public bool IsAlternative { get; set; }
    public bool IsActive { get; set; }
    public TimeSpan? EstimatedDuration { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public virtual ICollection<Stop> Stops { get; set; } = new HashSet<Stop>();
    public virtual ICollection<TransportationGroup> Groups { get; set; } = new HashSet<TransportationGroup>();
}
