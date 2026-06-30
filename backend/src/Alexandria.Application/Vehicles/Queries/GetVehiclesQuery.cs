using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using MediatR;

namespace Alexandria.Application.Vehicles.Queries;

public class GetVehiclesQuery : SearchRequest, IRequest<PaginatedList<VehicleDto>>
{
    public Guid? DriverId { get; set; }
    public string? Status { get; set; }
    public string? Type { get; set; }
}
