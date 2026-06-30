using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Queries;

public class GetVehicleMaintenanceQuery : IRequest<Result<object>>
{
    public Guid VehicleId { get; set; }
}

public class GetVehicleMaintenanceQueryHandler : IRequestHandler<GetVehicleMaintenanceQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetVehicleMaintenanceQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
