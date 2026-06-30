using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Entities;
using MediatR;

namespace Alexandria.Application.Drivers.Commands;

public class UpdateDriverLocationCommand : IRequest<Result>
{
    public Guid DriverId { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? Speed { get; set; }
    public double? Heading { get; set; }
}

public class UpdateDriverLocationCommandHandler : IRequestHandler<UpdateDriverLocationCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateDriverLocationCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(UpdateDriverLocationCommand request, CancellationToken cancellationToken)
    {
        var location = new UserLocation
        {
            UserId = request.DriverId,
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
