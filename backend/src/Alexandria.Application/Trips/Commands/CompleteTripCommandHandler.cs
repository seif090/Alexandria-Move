using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Trips.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Trips.Commands;

public class CompleteTripCommandHandler : IRequestHandler<CompleteTripCommand, Result<TripDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public CompleteTripCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<TripDto>> Handle(CompleteTripCommand request, CancellationToken cancellationToken)
    {
        var trip = await _context.Trips
            .Include(t => t.Group)
            .Include(t => t.Driver).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(t => t.Id == request.TripId, cancellationToken);

        if (trip == null) return Result<TripDto>.Failure("Trip not found");
        if (trip.Status != TripStatus.InProgress) return Result<TripDto>.Failure("Trip can only be completed from InProgress status");

        trip.Status = TripStatus.Completed;
        trip.CompletedAt = _dateTime.UtcNow;
        if (request.Notes != null) trip.Notes = request.Notes;

        var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.Id == trip.DriverId, cancellationToken);
        if (driver != null) driver.TotalTrips++;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<TripDto>.Success(_mapper.Map<TripDto>(trip));
    }
}
