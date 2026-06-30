using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Commands;

public class CancelBookingCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
