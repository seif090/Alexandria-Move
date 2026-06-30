using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Roles.Commands;

public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteRoleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.Users)
            .Include(r => r.Permissions)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (role == null) return Result.Failure("Role not found");
        if (role.Users.Any()) return Result.Failure("Cannot delete role with assigned users");

        _context.RolePermissions.RemoveRange(role.Permissions);
        _context.Roles.Remove(role);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Role deleted successfully");
    }
}
