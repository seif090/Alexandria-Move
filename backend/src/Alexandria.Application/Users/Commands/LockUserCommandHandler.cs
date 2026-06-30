using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Users.Commands;

public class LockUserCommandHandler : IRequestHandler<LockUserCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public LockUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(LockUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
        if (user == null) return Result.Failure("User not found");

        user.Status = UserStatus.Locked;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("User locked successfully");
    }
}
