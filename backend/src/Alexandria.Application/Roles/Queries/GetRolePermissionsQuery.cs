using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Roles.Queries;

public class GetRolePermissionsQuery : IRequest<Result<object>>
{
    public Guid RoleId { get; set; }
}