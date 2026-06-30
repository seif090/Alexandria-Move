using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using MediatR;

namespace Alexandria.Application.Roles.Queries;

public class GetRoleByIdQuery : IRequest<Result<RoleDto>>
{
    public Guid Id { get; set; }
}
