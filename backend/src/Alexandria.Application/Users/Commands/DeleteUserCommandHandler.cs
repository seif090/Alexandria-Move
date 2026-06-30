using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Users.Commands;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
        if (user == null) return Result.Failure("User not found");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("User deleted successfully");
    }
}
