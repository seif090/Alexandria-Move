using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Ratings.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Ratings.Queries;

public class GetRatingsQueryHandler : IRequestHandler<GetRatingsQuery, PaginatedList<RatingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRatingsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<RatingDto>> Handle(GetRatingsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Ratings
            .Include(r => r.User)
            .AsQueryable();

        if (request.DriverId.HasValue)
            query = query.Where(r => r.DriverId == request.DriverId.Value);

        if (request.TripId.HasValue)
            query = query.Where(r => r.TripId == request.TripId.Value);

        if (request.MinScore.HasValue)
            query = query.Where(r => r.Score >= request.MinScore.Value);

        if (request.MaxScore.HasValue)
            query = query.Where(r => r.Score <= request.MaxScore.Value);

        query = query.OrderByDescending(r => r.CreatedAt);

        return await PaginatedList<RatingDto>.CreateAsync(
            query.ProjectTo<RatingDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
