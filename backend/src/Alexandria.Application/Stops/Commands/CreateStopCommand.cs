using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using MediatR;

namespace Alexandria.Application.Stops.Commands;

public class CreateStopCommand : IRequest<Result<StopDto>>
{
    public Guid RouteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Order { get; set; }
    public int? EstimatedArrivalMinutes { get; set; }
}
