using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using MediatR;

namespace Alexandria.Application.Routes.Queries;

public class GetRoutesQuery : SearchRequest, IRequest<PaginatedList<RouteDto>>
{
    public Guid? CommunityId { get; set; }
    public bool? IsActive { get; set; }
}
