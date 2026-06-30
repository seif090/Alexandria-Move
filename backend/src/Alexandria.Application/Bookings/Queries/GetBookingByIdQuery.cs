using Alexandria.Application.Bookings.DTOs;
using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Queries;

public class GetBookingByIdQuery : IRequest<Result<BookingDto>>
{
    public Guid Id { get; set; }
}
