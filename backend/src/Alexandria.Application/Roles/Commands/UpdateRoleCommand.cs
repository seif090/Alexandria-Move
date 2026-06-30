using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using MediatR;

namespace Alexandria.Application.Roles.Commands;

public class UpdateRoleCommand : IRequest<Result<RoleDto>>
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool? IsDefault { get; set; }
}
