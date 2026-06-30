using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using MediatR;

namespace Alexandria.Application.Vehicles.Queries;

public class GetVehicleByIdQuery : IRequest<Result<VehicleDto>>
{
    public Guid Id { get; set; }
}
