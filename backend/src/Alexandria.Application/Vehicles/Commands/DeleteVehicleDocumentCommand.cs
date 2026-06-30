using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class DeleteVehicleDocumentCommand : IRequest<Result>
{
    public Guid VehicleId { get; set; }
    public Guid DocumentId { get; set; }
}