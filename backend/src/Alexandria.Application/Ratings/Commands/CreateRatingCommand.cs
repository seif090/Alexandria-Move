using Alexandria.Application.Common.Models;
using Alexandria.Application.Ratings.DTOs;
using MediatR;

namespace Alexandria.Application.Ratings.Commands;

public class CreateRatingCommand : IRequest<Result<RatingDto>>
{
    public Guid? DriverId { get; set; }
    public Guid? TripId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
}
