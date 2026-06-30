using Alexandria.Application.Bookings.DTOs;
using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Bookings.Queries;

public class GetBookingsQueryHandler : IRequestHandler<GetBookingsQuery, PaginatedList<BookingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBookingsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BookingDto>> Handle(GetBookingsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Group)
            .AsQueryable();

        if (request.UserId.HasValue)
            query = query.Where(b => b.UserId == request.UserId.Value);

        if (request.GroupId.HasValue)
            query = query.Where(b => b.GroupId == request.GroupId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<BookingStatus>(request.Status, true, out var status))
            query = query.Where(b => b.Status == status);

        if (request.FromDate.HasValue)
            query = query.Where(b => b.BookedAt >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(b => b.BookedAt <= request.ToDate.Value);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(b => b.User.FullName.ToLower().Contains(term) || b.Group.Name.ToLower().Contains(term));
        }

        query = request.SortBy switch
        {
            "bookedAt" => request.SortDescending ? query.OrderByDescending(b => b.BookedAt) : query.OrderBy(b => b.BookedAt),
            "status" => request.SortDescending ? query.OrderByDescending(b => b.Status) : query.OrderBy(b => b.Status),
            _ => query.OrderByDescending(b => b.BookedAt)
        };

        return await PaginatedList<BookingDto>.CreateAsync(
            query.ProjectTo<BookingDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
