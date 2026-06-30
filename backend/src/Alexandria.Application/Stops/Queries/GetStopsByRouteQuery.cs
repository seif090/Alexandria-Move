using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Stops.Queries;

public class GetStopsByRouteQuery : IRequest<Result<object>>
{
    public Guid RouteId { get; set; }
}