using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Trips.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Trips.Queries;

public class GetTripByIdQueryHandler : IRequestHandler<GetTripByIdQuery, Result<TripDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTripByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<TripDto>> Handle(GetTripByIdQuery request, CancellationToken cancellationToken)
    {
        var trip = await _context.Trips
            .Include(t => t.Group)
            .Include(t => t.Driver).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

        if (trip == null) return Result<TripDto>.Failure("Trip not found");

        return Result<TripDto>.Success(_mapper.Map<TripDto>(trip));
    }
}
