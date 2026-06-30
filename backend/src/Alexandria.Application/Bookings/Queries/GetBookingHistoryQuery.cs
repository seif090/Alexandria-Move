using Alexandria.Application.Bookings.DTOs;
using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Queries;

public class GetBookingHistoryQuery : SearchRequest, IRequest<PaginatedList<BookingDto>>
{
    public Guid UserId { get; set; }

    public Guid BookingId { get; set; }
}