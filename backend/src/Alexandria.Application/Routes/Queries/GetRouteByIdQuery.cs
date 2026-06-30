using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using MediatR;

namespace Alexandria.Application.Routes.Queries;

public class GetRouteByIdQuery : IRequest<Result<RouteDto>>
{
    public Guid Id { get; set; }
}
