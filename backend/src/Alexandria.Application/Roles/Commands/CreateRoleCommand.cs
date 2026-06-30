using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using MediatR;

namespace Alexandria.Application.Roles.Commands;

public class CreateRoleCommand : IRequest<Result<RoleDto>>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsDefault { get; set; }
    public List<string>? Permissions { get; set; }
}
