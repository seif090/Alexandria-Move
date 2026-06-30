using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Trips.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Trips.Queries;

public class GetTripsQueryHandler : IRequestHandler<GetTripsQuery, PaginatedList<TripDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTripsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<TripDto>> Handle(GetTripsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Trips
            .Include(t => t.Group)
            .Include(t => t.Driver).ThenInclude(d => d.User)
            .AsQueryable();

        if (request.GroupId.HasValue)
            query = query.Where(t => t.GroupId == request.GroupId.Value);

        if (request.DriverId.HasValue)
            query = query.Where(t => t.DriverId == request.DriverId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<TripStatus>(request.Status, true, out var status))
            query = query.Where(t => t.Status == status);

        if (request.FromDate.HasValue)
            query = query.Where(t => t.ScheduledDate >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(t => t.ScheduledDate <= request.ToDate.Value);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(t => t.Group.Name.ToLower().Contains(term) || t.Driver.User.FullName.ToLower().Contains(term));
        }

        query = request.SortBy switch
        {
            "scheduledDate" => request.SortDescending ? query.OrderByDescending(t => t.ScheduledDate) : query.OrderBy(t => t.ScheduledDate),
            "status" => request.SortDescending ? query.OrderByDescending(t => t.Status) : query.OrderBy(t => t.Status),
            _ => query.OrderByDescending(t => t.ScheduledDate)
        };

        return await PaginatedList<TripDto>.CreateAsync(
            query.ProjectTo<TripDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
