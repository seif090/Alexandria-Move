using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Roles.Commands;

public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, Result<RoleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateRoleCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<RoleDto>> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
        if (role == null) return Result<RoleDto>.Failure("Role not found");

        if (request.Name != null) role.Name = request.Name;
        if (request.Description != null) role.Description = request.Description;
        if (request.IsDefault.HasValue) role.IsDefault = request.IsDefault.Value;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<RoleDto>(role);
        dto.Permissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == role.Id)
            .Select(rp => new RolePermissionDto { Id = rp.Id, Permission = rp.PermissionName })
            .ToListAsync(cancellationToken);

        return Result<RoleDto>.Success(dto);
    }
}
