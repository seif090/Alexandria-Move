using Alexandria.Application.Bookings.DTOs;
using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Bookings.Queries;

public class GetBookingByIdQueryHandler : IRequestHandler<GetBookingByIdQuery, Result<BookingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBookingByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<BookingDto>> Handle(GetBookingByIdQuery request, CancellationToken cancellationToken)
    {
        var booking = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Group)
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (booking == null) return Result<BookingDto>.Failure("Booking not found");

        return Result<BookingDto>.Success(_mapper.Map<BookingDto>(booking));
    }
}
