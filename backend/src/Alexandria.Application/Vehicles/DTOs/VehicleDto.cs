using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Vehicles.DTOs;

public class VehicleDto : IMapFrom<Vehicle>
{
    public Guid Id { get; set; }
    public Guid DriverId { get; set; }
    public string DriverName { get; set; } = string.Empty;
    public string PlateNumber { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Capacity { get; set; }
    public VehicleType Type { get; set; }
    public VehicleStatus Status { get; set; }
    public bool IsVerified { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateVehicleDto
{
    public Guid DriverId { get; set; }
    public string PlateNumber { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Capacity { get; set; }
    public string Type { get; set; } = string.Empty;
}

public class UpdateVehicleDto
{
    public string? PlateNumber { get; set; }
    public string? Model { get; set; }
    public string? Color { get; set; }
    public int? Year { get; set; }
    public int? Capacity { get; set; }
    public string? Type { get; set; }
    public string? Status { get; set; }
}
