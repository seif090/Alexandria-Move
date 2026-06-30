using Alexandria.Application.Bookings.DTOs;
using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Queries;

public class GetBookingsQuery : SearchRequest, IRequest<PaginatedList<BookingDto>>
{
    public Guid? UserId { get; set; }
    public Guid? GroupId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
