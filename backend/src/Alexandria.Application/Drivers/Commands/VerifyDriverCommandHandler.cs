using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Commands;

public class VerifyDriverCommandHandler : IRequestHandler<VerifyDriverCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public VerifyDriverCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(VerifyDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);
        if (driver == null) return Result.Failure("Driver not found");

        driver.IsVerified = true;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Driver verified successfully");
    }
}
