using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using MediatR;

namespace Alexandria.Application.Groups.Queries;

public class GetGroupsQuery : SearchRequest, IRequest<PaginatedList<GroupDto>>
{
    public Guid? CommunityId { get; set; }
    public Guid? RouteId { get; set; }
    public Guid? DriverId { get; set; }
    public string? Status { get; set; }
    public string? WorkingDay { get; set; }
}
