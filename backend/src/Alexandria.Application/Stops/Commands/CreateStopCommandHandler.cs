using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using Alexandria.Domain.Entities;
using AutoMapper;
using MediatR;

namespace Alexandria.Application.Stops.Commands;

public class CreateStopCommandHandler : IRequestHandler<CreateStopCommand, Result<StopDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateStopCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<StopDto>> Handle(CreateStopCommand request, CancellationToken cancellationToken)
    {
        var stop = new Stop
        {
            RouteId = request.RouteId,
            Name = request.Name,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Order = request.Order,
            EstimatedArrivalMinutes = request.EstimatedArrivalMinutes,
            IsActive = true
        };

        _context.Stops.Add(stop);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<StopDto>.Success(_mapper.Map<StopDto>(stop));
    }
}
