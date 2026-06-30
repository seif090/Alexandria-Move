using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Vehicles.Commands;

public class DeleteVehicleCommandHandler : IRequestHandler<DeleteVehicleCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteVehicleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteVehicleCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == request.Id, cancellationToken);
        if (vehicle == null) return Result.Failure("Vehicle not found");

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Vehicle deleted successfully");
    }
}
