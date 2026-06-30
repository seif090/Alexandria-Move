using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class UpdateVehicleStatusCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class UpdateVehicleStatusCommandHandler : IRequestHandler<UpdateVehicleStatusCommand, Result>
{
    public Task<Result> Handle(UpdateVehicleStatusCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
