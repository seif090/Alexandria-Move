using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Trips.DTOs;

public class TripDto : IMapFrom<Trip>
{
    public Guid Id { get; set; }
    public Guid GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public Guid DriverId { get; set; }
    public string DriverName { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public TripStatus Status { get; set; }
    public int TotalPassengers { get; set; }
    public decimal? Revenue { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTripDto
{
    public Guid GroupId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string? Notes { get; set; }
}
