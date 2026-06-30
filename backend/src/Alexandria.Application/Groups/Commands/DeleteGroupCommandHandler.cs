using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Groups.Commands;

public class DeleteGroupCommandHandler : IRequestHandler<DeleteGroupCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.TransportationGroups
            .Include(g => g.Bookings)
            .Include(g => g.Trips)
            .FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);

        if (group == null) return Result.Failure("Group not found");

        _context.Bookings.RemoveRange(group.Bookings);
        _context.Trips.RemoveRange(group.Trips);
        _context.TransportationGroups.Remove(group);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Group deleted successfully");
    }
}
