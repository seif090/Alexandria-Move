using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Entities;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class UpdateTripLocationCommand : IRequest<Result>
{
    public Guid TripId { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Speed { get; set; }
    public double? Heading { get; set; }
}

public class UpdateTripLocationCommandHandler : IRequestHandler<UpdateTripLocationCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateTripLocationCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(UpdateTripLocationCommand request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUser.UserId, out var userId))
            return Result.Failure("User not authenticated");

        var trip = await _context.Trips.FindAsync(new object[] { request.TripId }, cancellationToken);
        if (trip == null)
            return Result.Failure("Trip not found");

        if (trip.DriverId != userId)
            return Result.Failure("Only the assigned driver can update trip location");

        var location = new UserLocation
        {
            UserId = userId,
            TripId = request.TripId,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Speed = request.Speed,
            Heading = request.Heading,
            Timestamp = DateTime.UtcNow,
        };

        _context.UserLocations.Add(location);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
