using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using MediatR;

namespace Alexandria.Application.Routes.Commands;

public class CreateRouteCommand : IRequest<Result<RouteDto>>
{
    public string Name { get; set; } = string.Empty;
    public string StartLocation { get; set; } = string.Empty;
    public double StartLatitude { get; set; }
    public double StartLongitude { get; set; }
    public string EndLocation { get; set; } = string.Empty;
    public double EndLatitude { get; set; }
    public double EndLongitude { get; set; }
    public double? Distance { get; set; }
    public int? EstimatedDuration { get; set; }
    public Guid? CommunityId { get; set; }
}
