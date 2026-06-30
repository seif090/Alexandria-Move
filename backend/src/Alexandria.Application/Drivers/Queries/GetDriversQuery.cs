using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using MediatR;

namespace Alexandria.Application.Drivers.Queries;

public class GetDriversQuery : SearchRequest, IRequest<PaginatedList<DriverDto>>
{
    public string? Status { get; set; }
    public bool? IsVerified { get; set; }
    public double? MinRating { get; set; }
    public double? MaxRating { get; set; }
}
