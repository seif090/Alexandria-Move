using Alexandria.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Ratings.Queries;

public class GetAverageRatingQueryHandler : IRequestHandler<GetAverageRatingQuery, double>
{
    private readonly IApplicationDbContext _context;

    public GetAverageRatingQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<double> Handle(GetAverageRatingQuery request, CancellationToken cancellationToken)
    {
        return await _context.Ratings
            .Where(r => r.DriverId == request.DriverId)
            .AverageAsync(r => (double?)r.Score, cancellationToken) ?? 0;
    }
}
