using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Trips.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Trips.Commands;

public class StartTripCommandHandler : IRequestHandler<StartTripCommand, Result<TripDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public StartTripCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<TripDto>> Handle(StartTripCommand request, CancellationToken cancellationToken)
    {
        var trip = await _context.Trips
            .Include(t => t.Group)
            .Include(t => t.Driver).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(t => t.Id == request.TripId, cancellationToken);

        if (trip == null) return Result<TripDto>.Failure("Trip not found");
        if (trip.Status != TripStatus.Scheduled) return Result<TripDto>.Failure("Trip can only be started from Scheduled status");

        trip.Status = TripStatus.InProgress;
        trip.StartedAt = _dateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return Result<TripDto>.Success(_mapper.Map<TripDto>(trip));
    }
}
