using Alexandria.Application.Common.Models;
using Alexandria.Application.Ratings.DTOs;
using MediatR;

namespace Alexandria.Application.Ratings.Queries;

public class GetRatingsQuery : SearchRequest, IRequest<PaginatedList<RatingDto>>
{
    public Guid? DriverId { get; set; }
    public Guid? TripId { get; set; }
    public int? MinScore { get; set; }
    public int? MaxScore { get; set; }
}
