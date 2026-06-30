using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using MediatR;

namespace Alexandria.Application.Roles.Queries;

public class GetRolesQuery : SearchRequest, IRequest<PaginatedList<RoleDto>>
{
    public bool? IsDefault { get; set; }
}
