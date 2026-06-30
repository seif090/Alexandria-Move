using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Queries;

public class GetVehicleDocumentsQuery : IRequest<Result<object>>
{
    public Guid VehicleId { get; set; }
}