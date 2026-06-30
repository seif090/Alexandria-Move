using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;

namespace Alexandria.Application.Routes.DTOs;

public class RouteDto : IMapFrom<Route>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string StartLocation { get; set; } = string.Empty;
    public double StartLatitude { get; set; }
    public double StartLongitude { get; set; }
    public string EndLocation { get; set; } = string.Empty;
    public double EndLatitude { get; set; }
    public double EndLongitude { get; set; }
    public double? Distance { get; set; }
    public int? EstimatedDuration { get; set; }
    public bool IsActive { get; set; }
    public Guid? CommunityId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateRouteDto
{
    public string Name { get; set; } = string.Empty;
    public string StartLocation { get; set; } = string.Empty;
    public double StartLatitude { get; set; }
    public double StartLongitude { get; set; }
    public string EndLocation { get; set; } = string.Empty;
    public double EndLatitude { get; set; }
    public double EndLongitude { get; set; }
    public double? Distance { get; set; }
    public int? EstimatedDuration { get; set; }
    public Guid? CommunityId { get; set; }
}

public class UpdateRouteDto
{
    public string? Name { get; set; }
    public string? StartLocation { get; set; }
    public double? StartLatitude { get; set; }
    public double? StartLongitude { get; set; }
    public string? EndLocation { get; set; }
    public double? EndLatitude { get; set; }
    public double? EndLongitude { get; set; }
    public double? Distance { get; set; }
    public int? EstimatedDuration { get; set; }
    public bool? IsActive { get; set; }
}
