using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class UpdateMaintenanceCommand : IRequest<Result>
{    public Guid VehicleId { get; set; }
    public Guid MaintenanceId { get; set; }
}

public class UpdateMaintenanceCommandHandler : IRequestHandler<UpdateMaintenanceCommand, Result>
{
    public Task<Result> Handle(UpdateMaintenanceCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
