using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using MediatR;

namespace Alexandria.Application.Roles.Commands;

public class AssignPermissionsCommand : IRequest<Result<RoleDto>>
{
    public Guid RoleId { get; set; }
    public List<string> Permissions { get; set; } = new();
}
