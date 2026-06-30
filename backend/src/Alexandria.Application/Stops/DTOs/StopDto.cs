using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;

namespace Alexandria.Application.Stops.DTOs;

public class StopDto : IMapFrom<Stop>
{
    public Guid Id { get; set; }
    public Guid RouteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Order { get; set; }
    public int? EstimatedArrivalMinutes { get; set; }
    public bool IsActive { get; set; }
}

public class CreateStopDto
{
    public Guid RouteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Order { get; set; }
    public int? EstimatedArrivalMinutes { get; set; }
}

public class UpdateStopDto
{
    public string? Name { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int? Order { get; set; }
    public int? EstimatedArrivalMinutes { get; set; }
    public bool? IsActive { get; set; }
}
