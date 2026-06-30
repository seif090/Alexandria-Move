using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Bookings.Commands;

public class RejectBookingCommandHandler : IRequestHandler<RejectBookingCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;

    public RejectBookingCommandHandler(IApplicationDbContext context, IDateTime dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(RejectBookingCommand request, CancellationToken cancellationToken)
    {
        var booking = await _context.Bookings.Include(b => b.Group).FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);
        if (booking == null) return Result.Failure("Booking not found");

        booking.Status = BookingStatus.Rejected;
        booking.CancelledAt = _dateTime.UtcNow;

        if (booking.Group != null)
            booking.Group.AvailableSeats++;

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Booking rejected successfully");
    }
}
