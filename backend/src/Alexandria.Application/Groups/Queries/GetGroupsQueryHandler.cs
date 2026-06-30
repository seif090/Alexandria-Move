using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Groups.Queries;

public class GetGroupsQueryHandler : IRequestHandler<GetGroupsQuery, PaginatedList<GroupDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetGroupsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<GroupDto>> Handle(GetGroupsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.TransportationGroups
            .Include(g => g.Community)
            .Include(g => g.Route)
            .Include(g => g.Driver).ThenInclude(d => d.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(g => g.Name.ToLower().Contains(term) || (g.Description != null && g.Description.ToLower().Contains(term)));
        }

        if (request.CommunityId.HasValue)
            query = query.Where(g => g.CommunityId == request.CommunityId.Value);

        if (request.RouteId.HasValue)
            query = query.Where(g => g.RouteId == request.RouteId.Value);

        if (request.DriverId.HasValue)
            query = query.Where(g => g.DriverId == request.DriverId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<GroupStatus>(request.Status, true, out var status))
            query = query.Where(g => g.Status == status);

        if (!string.IsNullOrWhiteSpace(request.WorkingDay) && Enum.TryParse<DayOfWeek>(request.WorkingDay, true, out var day))
            query = query.Where(g => g.WorkingDays.Contains(day.ToString()));

        query = request.SortBy switch
        {
            "name" => request.SortDescending ? query.OrderByDescending(g => g.Name) : query.OrderBy(g => g.Name),
            "capacity" => request.SortDescending ? query.OrderByDescending(g => g.Capacity) : query.OrderBy(g => g.Capacity),
            "departureTime" => request.SortDescending ? query.OrderByDescending(g => g.DepartureTime) : query.OrderBy(g => g.DepartureTime),
            "price" => request.SortDescending ? query.OrderByDescending(g => g.Price) : query.OrderBy(g => g.Price),
            _ => query.OrderByDescending(g => g.CreatedAt)
        };

        return await PaginatedList<GroupDto>.CreateAsync(
            query.ProjectTo<GroupDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
