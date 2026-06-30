using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class UpdateVehicleCommand : IRequest<Result<VehicleDto>>
{
    public Guid Id { get; set; }
    public string? PlateNumber { get; set; }
    public string? Model { get; set; }
    public string? Color { get; set; }
    public int? Year { get; set; }
    public int? Capacity { get; set; }
    public string? Type { get; set; }
    public string? Status { get; set; }
}
