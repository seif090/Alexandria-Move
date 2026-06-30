using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Stops.Commands;

public class UpdateStopCommandHandler : IRequestHandler<UpdateStopCommand, Result<StopDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateStopCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<StopDto>> Handle(UpdateStopCommand request, CancellationToken cancellationToken)
    {
        var stop = await _context.Stops.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
        if (stop == null) return Result<StopDto>.Failure("Stop not found");

        if (request.Name != null) stop.Name = request.Name;
        if (request.Latitude.HasValue) stop.Latitude = request.Latitude.Value;
        if (request.Longitude.HasValue) stop.Longitude = request.Longitude.Value;
        if (request.Order.HasValue) stop.Order = request.Order.Value;
        if (request.EstimatedArrivalMinutes.HasValue) stop.EstimatedArrivalMinutes = request.EstimatedArrivalMinutes.Value;
        if (request.IsActive.HasValue) stop.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync(cancellationToken);
        return Result<StopDto>.Success(_mapper.Map<StopDto>(stop));
    }
}
