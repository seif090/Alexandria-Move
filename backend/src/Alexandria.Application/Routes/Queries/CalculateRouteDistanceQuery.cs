using MediatR;

namespace Alexandria.Application.Routes.Queries;

public class CalculateRouteDistanceQuery : IRequest<(double Distance, double Duration)>
{
    public double OriginLatitude { get; set; }
    public double OriginLongitude { get; set; }
    public double DestinationLatitude { get; set; }
    public double DestinationLongitude { get; set; }

    public Guid RouteId { get; set; }
}