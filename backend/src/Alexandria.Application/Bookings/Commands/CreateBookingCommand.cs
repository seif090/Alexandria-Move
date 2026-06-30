using Alexandria.Application.Common.Models;
using Alexandria.Application.Bookings.DTOs;
using MediatR;

namespace Alexandria.Application.Bookings.Commands;

public class CreateBookingCommand : IRequest<Result<BookingDto>>
{
    public Guid GroupId { get; set; }
    public string? Notes { get; set; }
}
