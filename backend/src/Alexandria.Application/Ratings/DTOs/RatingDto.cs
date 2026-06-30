using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;

namespace Alexandria.Application.Ratings.DTOs;

public class RatingDto : IMapFrom<Rating>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid? DriverId { get; set; }
    public string? DriverName { get; set; }
    public Guid? TripId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateRatingDto
{
    public Guid? DriverId { get; set; }
    public Guid? TripId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
}
