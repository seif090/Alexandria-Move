using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Roles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Roles.Queries;

public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, PaginatedList<RoleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRolesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Roles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(term) || (r.Description != null && r.Description.ToLower().Contains(term)));
        }

        if (request.IsDefault.HasValue)
            query = query.Where(r => r.IsDefault == request.IsDefault.Value);

        query = request.SortBy switch
        {
            "name" => request.SortDescending ? query.OrderByDescending(r => r.Name) : query.OrderBy(r => r.Name),
            "createdAt" => request.SortDescending ? query.OrderByDescending(r => r.CreatedAt) : query.OrderBy(r => r.CreatedAt),
            _ => query.OrderBy(r => r.Name)
        };

        return await PaginatedList<RoleDto>.CreateAsync(
            query.ProjectTo<RoleDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
