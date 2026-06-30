using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Commands;

public class ApproveBookingCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
