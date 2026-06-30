using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Drivers.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Queries;

public class GetDriverPerformanceQueryHandler : IRequestHandler<GetDriverPerformanceQuery, DriverScoreDto>
{
    private readonly IApplicationDbContext _context;

    public GetDriverPerformanceQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DriverScoreDto> Handle(GetDriverPerformanceQuery request, CancellationToken cancellationToken)
    {
        var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.Id == request.DriverId, cancellationToken);
        if (driver == null) return new DriverScoreDto();

        var completedTrips = await _context.Trips.CountAsync(t => t.DriverId == request.DriverId && t.Status == Domain.Enums.TripStatus.Completed, cancellationToken);
        var cancelledTrips = await _context.Trips.CountAsync(t => t.DriverId == request.DriverId && t.Status == Domain.Enums.TripStatus.Cancelled, cancellationToken);
        var totalTrips = completedTrips + cancelledTrips;

        var reliabilityScore = totalTrips > 0 ? (double)completedTrips / totalTrips * 100 : 0;
        var ratingScore = (driver.Rating ?? 0) / 5.0 * 100;

        return new DriverScoreDto
        {
            DriverId = request.DriverId,
            OverallScore = (reliabilityScore + ratingScore) / 2,
            RatingScore = ratingScore,
            ReliabilityScore = reliabilityScore,
            CompletedTrips = completedTrips,
            CancelledTrips = cancelledTrips
        };
    }
}
