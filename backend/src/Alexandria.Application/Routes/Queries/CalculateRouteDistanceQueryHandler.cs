using Alexandria.Application.Common.Interfaces;
using MediatR;

namespace Alexandria.Application.Routes.Queries;

public class CalculateRouteDistanceQueryHandler : IRequestHandler<CalculateRouteDistanceQuery, (double Distance, double Duration)>
{
    private readonly IMapService _mapService;

    public CalculateRouteDistanceQueryHandler(IMapService mapService)
    {
        _mapService = mapService;
    }

    public async Task<(double Distance, double Duration)> Handle(CalculateRouteDistanceQuery request, CancellationToken cancellationToken)
    {
        return await _mapService.CalculateDistanceAsync(
            request.OriginLatitude, request.OriginLongitude,
            request.DestinationLatitude, request.DestinationLongitude);
    }
}
