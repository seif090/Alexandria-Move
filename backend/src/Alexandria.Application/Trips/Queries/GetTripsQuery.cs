using Alexandria.Application.Common.Models;
using Alexandria.Application.Trips.DTOs;
using MediatR;

namespace Alexandria.Application.Trips.Queries;

public class GetTripsQuery : SearchRequest, IRequest<PaginatedList<TripDto>>
{
    public Guid? GroupId { get; set; }
    public Guid? DriverId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
