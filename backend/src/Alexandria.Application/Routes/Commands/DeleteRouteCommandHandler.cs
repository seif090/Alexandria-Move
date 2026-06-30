using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Route = Alexandria.Domain.Entities.Route;

namespace Alexandria.Application.Routes.Commands;

public class DeleteRouteCommandHandler : IRequestHandler<DeleteRouteCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteRouteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteRouteCommand request, CancellationToken cancellationToken)
    {
        var route = await _context.Routes
            .Include(r => r.Stops)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (route == null) return Result.Failure("Route not found");

        _context.Stops.RemoveRange(route.Stops);
        _context.Routes.Remove(route);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Route deleted successfully");
    }
}
