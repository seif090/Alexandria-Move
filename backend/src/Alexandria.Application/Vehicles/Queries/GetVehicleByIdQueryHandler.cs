using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Vehicles.Queries;

public class GetVehicleByIdQueryHandler : IRequestHandler<GetVehicleByIdQuery, Result<VehicleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVehicleByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<VehicleDto>> Handle(GetVehicleByIdQuery request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.Driver.User)
            .FirstOrDefaultAsync(v => v.Id == request.Id, cancellationToken);

        if (vehicle == null) return Result<VehicleDto>.Failure("Vehicle not found");

        return Result<VehicleDto>.Success(_mapper.Map<VehicleDto>(vehicle));
    }
}
