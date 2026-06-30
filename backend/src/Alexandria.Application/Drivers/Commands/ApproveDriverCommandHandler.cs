using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Commands;

public class ApproveDriverCommandHandler : IRequestHandler<ApproveDriverCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public ApproveDriverCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(ApproveDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);
        if (driver == null) return Result.Failure("Driver not found");

        driver.Status = DriverStatus.Active;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Driver approved successfully");
    }
}
