using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Route = Alexandria.Domain.Entities.Route;

namespace Alexandria.Application.Routes.Commands;

public class UpdateRouteCommandHandler : IRequestHandler<UpdateRouteCommand, Result<RouteDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateRouteCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<RouteDto>> Handle(UpdateRouteCommand request, CancellationToken cancellationToken)
    {
        var route = await _context.Routes.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
        if (route == null) return Result<RouteDto>.Failure("Route not found");

        if (request.Name != null) route.Name = request.Name;
        if (request.StartLocation != null) route.StartLocation = request.StartLocation;
        if (request.StartLatitude.HasValue) route.StartLatitude = request.StartLatitude.Value;
        if (request.StartLongitude.HasValue) route.StartLongitude = request.StartLongitude.Value;
        if (request.EndLocation != null) route.EndLocation = request.EndLocation;
        if (request.EndLatitude.HasValue) route.EndLatitude = request.EndLatitude.Value;
        if (request.EndLongitude.HasValue) route.EndLongitude = request.EndLongitude.Value;
        if (request.Distance.HasValue) route.Distance = request.Distance.Value;
        if (request.EstimatedDuration.HasValue) route.EstimatedDuration = TimeSpan.FromMinutes(request.EstimatedDuration.Value);
        if (request.IsActive.HasValue) route.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync(cancellationToken);
        return Result<RouteDto>.Success(_mapper.Map<RouteDto>(route));
    }
}
