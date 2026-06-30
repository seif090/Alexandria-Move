using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Trips.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Trips.Queries;

public class GetActiveTripsQueryHandler : IRequestHandler<GetActiveTripsQuery, List<TripDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetActiveTripsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<TripDto>> Handle(GetActiveTripsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Trips
            .Include(t => t.Group)
            .Include(t => t.Driver).ThenInclude(d => d.User)
            .Where(t => t.Status == TripStatus.InProgress || t.Status == TripStatus.Scheduled)
            .AsQueryable();

        if (request.DriverId.HasValue)
            query = query.Where(t => t.DriverId == request.DriverId.Value);

        return await query
            .OrderBy(t => t.ScheduledDate)
            .ProjectTo<TripDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
