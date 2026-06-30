using Alexandria.Application.Bookings.DTOs;
using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Bookings.Queries;

public class GetBookingHistoryQueryHandler : IRequestHandler<GetBookingHistoryQuery, PaginatedList<BookingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBookingHistoryQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BookingDto>> Handle(GetBookingHistoryQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Group)
            .Where(b => b.UserId == request.UserId)
            .OrderByDescending(b => b.CreatedAt);

        return await PaginatedList<BookingDto>.CreateAsync(
            query.ProjectTo<BookingDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
