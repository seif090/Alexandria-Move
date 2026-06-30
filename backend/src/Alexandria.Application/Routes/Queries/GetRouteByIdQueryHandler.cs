using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Routes.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Route = Alexandria.Domain.Entities.Route;

namespace Alexandria.Application.Routes.Queries;

public class GetRouteByIdQueryHandler : IRequestHandler<GetRouteByIdQuery, Result<RouteDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRouteByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<RouteDto>> Handle(GetRouteByIdQuery request, CancellationToken cancellationToken)
    {
        var route = await _context.Routes.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
        if (route == null) return Result<RouteDto>.Failure("Route not found");

        return Result<RouteDto>.Success(_mapper.Map<RouteDto>(route));
    }
}
