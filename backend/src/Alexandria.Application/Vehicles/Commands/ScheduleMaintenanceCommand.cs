using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class ScheduleMaintenanceCommand : IRequest<Result>
{    public Guid VehicleId { get; set; }
}

public class ScheduleMaintenanceCommandHandler : IRequestHandler<ScheduleMaintenanceCommand, Result>
{
    public Task<Result> Handle(ScheduleMaintenanceCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
