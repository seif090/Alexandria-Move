using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Trips.Commands;

public class ConfirmPassengerCommandHandler : IRequestHandler<ConfirmPassengerCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;

    public ConfirmPassengerCommandHandler(IApplicationDbContext context, IDateTime dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(ConfirmPassengerCommand request, CancellationToken cancellationToken)
    {
        var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == request.TripId, cancellationToken);
        if (trip == null) return Result.Failure("Trip not found");

        var existing = await _context.TripPassengers.AnyAsync(tp => tp.TripId == request.TripId && tp.UserId == request.UserId, cancellationToken);
        if (existing) return Result.Failure("Passenger already confirmed");

        var tripPassenger = new TripPassenger
        {
            TripId = request.TripId,
            UserId = request.UserId,
            ConfirmedAt = _dateTime.UtcNow
        };

        _context.TripPassengers.Add(tripPassenger);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Passenger confirmed successfully");
    }
}
