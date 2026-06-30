using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Bookings.Commands;

public class ApproveBookingCommandHandler : IRequestHandler<ApproveBookingCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public ApproveBookingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(ApproveBookingCommand request, CancellationToken cancellationToken)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);
        if (booking == null) return Result.Failure("Booking not found");

        booking.Status = BookingStatus.Approved;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Booking approved successfully");
    }
}
