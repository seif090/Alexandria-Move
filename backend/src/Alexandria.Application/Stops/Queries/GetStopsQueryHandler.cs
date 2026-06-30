using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Stops.Queries;

public class GetStopsQueryHandler : IRequestHandler<GetStopsQuery, PaginatedList<StopDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetStopsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<StopDto>> Handle(GetStopsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Stops.AsQueryable();

        if (request.RouteId.HasValue)
            query = query.Where(s => s.RouteId == request.RouteId.Value);

        if (request.IsActive.HasValue)
            query = query.Where(s => s.IsActive == request.IsActive.Value);

        query = query.OrderBy(s => s.Order);

        return await PaginatedList<StopDto>.CreateAsync(
            query.ProjectTo<StopDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
