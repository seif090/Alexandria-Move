using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using MediatR;

namespace Alexandria.Application.Groups.Commands;

public class CreateGroupCommand : IRequest<Result<GroupDto>>
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
