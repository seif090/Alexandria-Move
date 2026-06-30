using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Groups.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Groups.Queries;

public class GetGroupRecommendationsQueryHandler : IRequestHandler<GetGroupRecommendationsQuery, List<GroupDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetGroupRecommendationsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<GroupDto>> Handle(GetGroupRecommendationsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.TransportationGroups
            .Include(g => g.Community)
            .Include(g => g.Route)
            .Include(g => g.Driver).ThenInclude(d => d.User)
            .Where(g => g.AvailableSeats > 0 && g.Status == Domain.Enums.GroupStatus.Active)
            .AsQueryable();

        if (request.CommunityId.HasValue)
            query = query.Where(g => g.CommunityId == request.CommunityId.Value);

        if (request.PreferredTime.HasValue)
        {
            var time = request.PreferredTime.Value;
            query = query.Where(g =>
                g.DepartureTime.Hours >= time.Hours - 2 &&
                g.DepartureTime.Hours <= time.Hours + 2);
        }

        query = query.OrderByDescending(g => g.Rating ?? 0)
            .ThenBy(g => g.Price)
            .Take(request.MaxResults);

        return await query.ProjectTo<GroupDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
    }
}
