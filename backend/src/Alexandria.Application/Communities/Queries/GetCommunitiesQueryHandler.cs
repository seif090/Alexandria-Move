using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Communities.Queries;

public class GetCommunitiesQueryHandler : IRequestHandler<GetCommunitiesQuery, PaginatedList<CommunityDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCommunitiesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<CommunityDto>> Handle(GetCommunitiesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Communities.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(term) || (c.Description != null && c.Description.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<CommunityType>(request.Type, true, out var type))
            query = query.Where(c => c.Type == type);

        if (!string.IsNullOrWhiteSpace(request.City))
            query = query.Where(c => c.City.ToLower() == request.City.ToLower());

        if (!string.IsNullOrWhiteSpace(request.Area))
            query = query.Where(c => c.Area.ToLower() == request.Area.ToLower());

        if (request.IsApproved.HasValue)
            query = query.Where(c => c.IsApproved == request.IsApproved.Value);

        if (request.IsActive.HasValue)
            query = query.Where(c => c.IsActive == request.IsActive.Value);

        query = request.SortBy switch
        {
            "name" => request.SortDescending ? query.OrderByDescending(c => c.Name) : query.OrderBy(c => c.Name),
            "city" => request.SortDescending ? query.OrderByDescending(c => c.City) : query.OrderBy(c => c.City),
            "createdAt" => request.SortDescending ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
            _ => query.OrderByDescending(c => c.CreatedAt)
        };

        return await PaginatedList<CommunityDto>.CreateAsync(
            query.ProjectTo<CommunityDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
