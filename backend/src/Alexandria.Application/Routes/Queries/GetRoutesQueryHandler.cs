using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Route = Alexandria.Domain.Entities.Route;

namespace Alexandria.Application.Routes.Queries;

public class GetRoutesQueryHandler : IRequestHandler<GetRoutesQuery, PaginatedList<RouteDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRoutesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<RouteDto>> Handle(GetRoutesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Routes.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(term) || r.StartLocation.ToLower().Contains(term) || r.EndLocation.ToLower().Contains(term));
        }

        if (request.CommunityId.HasValue)
            query = query.Where(r => r.CommunityId == request.CommunityId.Value);

        if (request.IsActive.HasValue)
            query = query.Where(r => r.IsActive == request.IsActive.Value);

        query = request.SortBy switch
        {
            "name" => request.SortDescending ? query.OrderByDescending(r => r.Name) : query.OrderBy(r => r.Name),
            "distance" => request.SortDescending ? query.OrderByDescending(r => r.Distance) : query.OrderBy(r => r.Distance),
            "createdAt" => request.SortDescending ? query.OrderByDescending(r => r.CreatedAt) : query.OrderBy(r => r.CreatedAt),
            _ => query.OrderByDescending(r => r.CreatedAt)
        };

        return await PaginatedList<RouteDto>.CreateAsync(
            query.ProjectTo<RouteDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
