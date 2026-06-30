using MediatR;

namespace Alexandria.Application.Ratings.Queries;

public class GetAverageRatingQuery : IRequest<double>
{
    public Guid DriverId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
}