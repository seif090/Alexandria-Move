using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Commands;

public class DeleteDriverCommandHandler : IRequestHandler<DeleteDriverCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteDriverCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);
        if (driver == null) return Result.Failure("Driver not found");

        _context.Drivers.Remove(driver);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Driver deleted successfully");
    }
}
