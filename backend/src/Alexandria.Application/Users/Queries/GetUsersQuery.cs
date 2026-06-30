using Alexandria.Application.Common.Models;
using Alexandria.Application.Users.DTOs;
using MediatR;

namespace Alexandria.Application.Users.Queries;

public class GetUsersQuery : SearchRequest, IRequest<PaginatedList<UserDto>>
{
    public bool? IsActive { get; set; }
    public bool? IsVerified { get; set; }
    public string? RoleName { get; set; }
    public DateTime? RegisteredFrom { get; set; }
    public DateTime? RegisteredTo { get; set; }
}
