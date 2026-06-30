using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Queries;

public class GetDriversQueryHandler : IRequestHandler<GetDriversQuery, PaginatedList<DriverDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDriversQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<DriverDto>> Handle(GetDriversQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Drivers.Include(d => d.User).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(d => d.User.FullName.ToLower().Contains(term) || d.User.Email.ToLower().Contains(term) || (d.LicenseNumber != null && d.LicenseNumber.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<DriverStatus>(request.Status, true, out var status))
            query = query.Where(d => d.Status == status);

        if (request.IsVerified.HasValue)
            query = query.Where(d => d.IsVerified == request.IsVerified.Value);

        if (request.MinRating.HasValue)
            query = query.Where(d => d.Rating >= request.MinRating.Value);

        if (request.MaxRating.HasValue)
            query = query.Where(d => d.Rating <= request.MaxRating.Value);

        query = request.SortBy switch
        {
            "rating" => request.SortDescending ? query.OrderByDescending(d => d.Rating) : query.OrderBy(d => d.Rating),
            "totalTrips" => request.SortDescending ? query.OrderByDescending(d => d.TotalTrips) : query.OrderBy(d => d.TotalTrips),
            "createdAt" => request.SortDescending ? query.OrderByDescending(d => d.CreatedAt) : query.OrderBy(d => d.CreatedAt),
            _ => query.OrderByDescending(d => d.CreatedAt)
        };

        return await PaginatedList<DriverDto>.CreateAsync(
            query.ProjectTo<DriverDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
