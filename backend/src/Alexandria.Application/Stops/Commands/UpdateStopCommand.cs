using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using MediatR;

namespace Alexandria.Application.Stops.Commands;

public class UpdateStopCommand : IRequest<Result<StopDto>>
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int? Order { get; set; }
    public int? EstimatedArrivalMinutes { get; set; }
    public bool? IsActive { get; set; }
}
