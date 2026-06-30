namespace Alexandria.Domain.Entities;

public class Stop : BaseEntity
{
    public Guid RouteId { get; set; }
    public virtual Route Route { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int OrderIndex { get; set; }
    public int Order { get; set; }
    public bool IsActive { get; set; }
    public double? EstimatedArrivalTime { get; set; }
    public int? EstimatedArrivalMinutes { get; set; }
    public int? PassengerCount { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
