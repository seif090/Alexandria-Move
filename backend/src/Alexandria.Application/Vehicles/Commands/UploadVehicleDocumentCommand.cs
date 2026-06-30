using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class UploadVehicleDocumentCommand : IRequest<Result>
{    public Guid VehicleId { get; set; }
}

public class UploadVehicleDocumentCommandHandler : IRequestHandler<UploadVehicleDocumentCommand, Result>
{
    public Task<Result> Handle(UploadVehicleDocumentCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
