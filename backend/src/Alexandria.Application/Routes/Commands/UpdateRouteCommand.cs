using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using MediatR;

namespace Alexandria.Application.Routes.Commands;

public class UpdateRouteCommand : IRequest<Result<RouteDto>>
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? StartLocation { get; set; }
    public double? StartLatitude { get; set; }
    public double? StartLongitude { get; set; }
    public string? EndLocation { get; set; }
    public double? EndLatitude { get; set; }
    public double? EndLongitude { get; set; }
    public double? Distance { get; set; }
    public int? EstimatedDuration { get; set; }
    public bool? IsActive { get; set; }
}
