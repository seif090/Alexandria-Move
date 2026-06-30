using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Bookings.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Bookings.Commands;

public class CreateBookingCommandHandler : IRequestHandler<CreateBookingCommand, Result<BookingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;

    public CreateBookingCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUser, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    public async Task<Result<BookingDto>> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.TransportationGroups.FirstOrDefaultAsync(g => g.Id == request.GroupId, cancellationToken);
        if (group == null) return Result<BookingDto>.Failure("Group not found");
        if (group.AvailableSeats <= 0) return Result<BookingDto>.Failure("No available seats");

        var existing = await _context.Bookings.AnyAsync(b => b.UserId.ToString() == _currentUser.UserId && b.GroupId == request.GroupId && b.Status == BookingStatus.Pending, cancellationToken);
        if (existing) return Result<BookingDto>.Failure("You already have an active booking in this group");

        var booking = new Booking
        {
            UserId = Guid.Parse(_currentUser.UserId!),
            GroupId = request.GroupId,
            Status = BookingStatus.Pending,
            Amount = group.Price,
            Notes = request.Notes,
            BookedAt = _dateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        group.AvailableSeats--;
        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<BookingDto>(booking);
        dto.GroupName = group.Name;
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == _currentUser.UserId, cancellationToken);
        if (user != null) dto.UserName = user.FullName;

        return Result<BookingDto>.Success(dto);
    }
}
