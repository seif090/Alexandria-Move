using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class CreateVehicleCommand : IRequest<Result<VehicleDto>>
{
    public Guid DriverId { get; set; }
    public string PlateNumber { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Capacity { get; set; }
    public string Type { get; set; } = string.Empty;
}
