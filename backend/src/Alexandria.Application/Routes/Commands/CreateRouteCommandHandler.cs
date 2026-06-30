using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using AutoMapper;
using MediatR;
using Route = Alexandria.Domain.Entities.Route;

namespace Alexandria.Application.Routes.Commands;

public class CreateRouteCommandHandler : IRequestHandler<CreateRouteCommand, Result<RouteDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public CreateRouteCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<RouteDto>> Handle(CreateRouteCommand request, CancellationToken cancellationToken)
    {
        var route = new Route
        {
            Name = request.Name,
            StartLocation = request.StartLocation,
            StartLatitude = request.StartLatitude,
            StartLongitude = request.StartLongitude,
            EndLocation = request.EndLocation,
            EndLatitude = request.EndLatitude,
            EndLongitude = request.EndLongitude,
            Distance = request.Distance ?? 0,
            EstimatedDuration = request.EstimatedDuration.HasValue ? TimeSpan.FromMinutes(request.EstimatedDuration.Value) : null,
            IsActive = true,
            CommunityId = request.CommunityId ?? Guid.Empty,
            CreatedAt = _dateTime.UtcNow
        };

        _context.Routes.Add(route);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<RouteDto>.Success(_mapper.Map<RouteDto>(route));
    }
}
