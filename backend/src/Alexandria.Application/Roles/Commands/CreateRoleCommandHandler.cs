using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using Alexandria.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Roles.Commands;

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, Result<RoleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public CreateRoleCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<RoleDto>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        var existing = await _context.Roles.AnyAsync(r => r.Name == request.Name, cancellationToken);
        if (existing) return Result<RoleDto>.Failure("Role already exists");

        var role = new Role
        {
            Name = request.Name,
            Description = request.Description,
            IsDefault = request.IsDefault,
            CreatedAt = _dateTime.UtcNow
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);

        if (request.Permissions?.Any() == true)
        {
            foreach (var perm in request.Permissions)
            {
                _context.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionName = perm });
            }
            await _context.SaveChangesAsync(cancellationToken);
        }

        var dto = _mapper.Map<RoleDto>(role);
        dto.Permissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == role.Id)
            .Select(rp => new RolePermissionDto { Id = rp.Id, Permission = rp.PermissionName })
            .ToListAsync(cancellationToken);

        return Result<RoleDto>.Success(dto);
    }
}
