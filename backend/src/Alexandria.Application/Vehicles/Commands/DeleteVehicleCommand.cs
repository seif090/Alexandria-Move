using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Vehicles.Commands;

public class DeleteVehicleCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
