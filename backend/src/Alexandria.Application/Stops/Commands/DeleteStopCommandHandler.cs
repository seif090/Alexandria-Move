using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Stops.Commands;

public class DeleteStopCommandHandler : IRequestHandler<DeleteStopCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteStopCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteStopCommand request, CancellationToken cancellationToken)
    {
        var stop = await _context.Stops.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
        if (stop == null) return Result.Failure("Stop not found");

        _context.Stops.Remove(stop);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Stop deleted successfully");
    }
}
