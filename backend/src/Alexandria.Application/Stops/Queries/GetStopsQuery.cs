using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using MediatR;

namespace Alexandria.Application.Stops.Queries;

public class GetStopsQuery : IRequest<PaginatedList<StopDto>>
{
    public Guid? RouteId { get; set; }
    public bool? IsActive { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
