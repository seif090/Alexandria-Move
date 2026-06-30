using Alexandria.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Roles.Queries;

public class GetPermissionsQueryHandler : IRequestHandler<GetPermissionsQuery, List<string>>
{
    private readonly IApplicationDbContext _context;

    public GetPermissionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<string>> Handle(GetPermissionsQuery request, CancellationToken cancellationToken)
    {
        return await _context.RolePermissions
            .Select(rp => rp.PermissionName)
            .Distinct()
            .OrderBy(p => p)
            .ToListAsync(cancellationToken);
    }
}
