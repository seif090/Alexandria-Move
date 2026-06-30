using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Vehicles.Commands;

public class UpdateVehicleCommandHandler : IRequestHandler<UpdateVehicleCommand, Result<VehicleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateVehicleCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<VehicleDto>> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles.Include(v => v.Driver.User).FirstOrDefaultAsync(v => v.Id == request.Id, cancellationToken);
        if (vehicle == null) return Result<VehicleDto>.Failure("Vehicle not found");

        if (request.PlateNumber != null) vehicle.PlateNumber = request.PlateNumber;
        if (request.Model != null) vehicle.Model = request.Model;
        if (request.Color != null) vehicle.Color = request.Color;
        if (request.Year.HasValue) vehicle.Year = request.Year.Value;
        if (request.Capacity.HasValue) vehicle.Capacity = request.Capacity.Value;
        if (request.Type != null && Enum.TryParse<VehicleType>(request.Type, true, out var type)) vehicle.Type = type;
        if (request.Status != null && Enum.TryParse<VehicleStatus>(request.Status, true, out var status)) vehicle.Status = status;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<VehicleDto>(vehicle);
        dto.DriverName = vehicle.Driver?.User?.FullName ?? string.Empty;

        return Result<VehicleDto>.Success(dto);
    }
}
