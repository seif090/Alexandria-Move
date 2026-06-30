using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Groups.DTOs;

public class GroupDto : IMapFrom<TransportationGroup>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public GroupType Type { get; set; }
    public Guid? CommunityId { get; set; }
    public string? CommunityName { get; set; }
    public Guid? RouteId { get; set; }
    public string? RouteName { get; set; }
    public Guid? DriverId { get; set; }
    public string? DriverName { get; set; }
    public int Capacity { get; set; }
    public int AvailableSeats { get; set; }
    public decimal? Price { get; set; }
    public TimeSpan? DepartureTime { get; set; }
    public TimeSpan? ArrivalTime { get; set; }
    public List<DayOfWeek> WorkingDays { get; set; } = new();
    public GroupStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateGroupDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public Guid? CommunityId { get; set; }
    public Guid? RouteId { get; set; }
    public Guid? DriverId { get; set; }
    public int Capacity { get; set; }
    public decimal? Price { get; set; }
    public TimeSpan? DepartureTime { get; set; }
    public TimeSpan? ArrivalTime { get; set; }
    public List<DayOfWeek> WorkingDays { get; set; } = new();
}

public class UpdateGroupDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public Guid? RouteId { get; set; }
    public Guid? DriverId { get; set; }
    public int? Capacity { get; set; }
    public decimal? Price { get; set; }
    public TimeSpan? DepartureTime { get; set; }
    public TimeSpan? ArrivalTime { get; set; }
    public List<DayOfWeek>? WorkingDays { get; set; }
}
