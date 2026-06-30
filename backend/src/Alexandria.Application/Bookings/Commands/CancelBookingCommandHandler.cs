using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Bookings.Commands;

public class CancelBookingCommandHandler : IRequestHandler<CancelBookingCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;

    public CancelBookingCommandHandler(IApplicationDbContext context, IDateTime dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(CancelBookingCommand request, CancellationToken cancellationToken)
    {
        var booking = await _context.Bookings.Include(b => b.Group).FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);
        if (booking == null) return Result.Failure("Booking not found");

        booking.Status = BookingStatus.Cancelled;
        booking.CancelledAt = _dateTime.UtcNow;

        if (booking.Group != null)
            booking.Group.AvailableSeats++;

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Booking cancelled successfully");
    }
}
