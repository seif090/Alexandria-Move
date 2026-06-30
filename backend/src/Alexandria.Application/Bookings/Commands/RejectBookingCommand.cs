using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Commands;

public class RejectBookingCommand : IRequest<Result>
{
    public Guid Id { get; set; }
    public string? Reason { get; set; }
}
