using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using Alexandria.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Roles.Commands;

public class AssignPermissionsCommandHandler : IRequestHandler<AssignPermissionsCommand, Result<RoleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public AssignPermissionsCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<RoleDto>> Handle(AssignPermissionsCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);
        if (role == null) return Result<RoleDto>.Failure("Role not found");

        var existingPermissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == request.RoleId)
            .ToListAsync(cancellationToken);

        _context.RolePermissions.RemoveRange(existingPermissions);

        foreach (var perm in request.Permissions)
        {
            _context.RolePermissions.Add(new RolePermission { RoleId = request.RoleId, PermissionName = perm });
        }

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<RoleDto>(role);
        dto.Permissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == role.Id)
            .Select(rp => new RolePermissionDto { Id = rp.Id, Permission = rp.PermissionName })
            .ToListAsync(cancellationToken);

        return Result<RoleDto>.Success(dto);
    }
}
