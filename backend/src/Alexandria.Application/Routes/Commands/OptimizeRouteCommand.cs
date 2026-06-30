using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Routes.Commands;

public class OptimizeRouteCommand : IRequest<Result>
{
    public Guid RouteId { get; set; }
}