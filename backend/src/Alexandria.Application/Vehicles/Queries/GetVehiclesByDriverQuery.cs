using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Queries;

public class GetVehiclesByDriverQuery : IRequest<Result<object>>
{
    public Guid DriverId { get; set; }
}