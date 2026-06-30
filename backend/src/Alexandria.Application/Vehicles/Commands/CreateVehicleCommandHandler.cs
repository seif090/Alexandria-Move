using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Vehicles.Commands;

public class CreateVehicleCommandHandler : IRequestHandler<CreateVehicleCommand, Result<VehicleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public CreateVehicleCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<VehicleDto>> Handle(CreateVehicleCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<VehicleType>(request.Type, true, out var type))
            return Result<VehicleDto>.Failure("Invalid vehicle type");

        var vehicle = new Vehicle
        {
            DriverId = request.DriverId,
            PlateNumber = request.PlateNumber,
            Model = request.Model,
            Color = request.Color,
            Year = request.Year,
            Capacity = request.Capacity,
            Type = type,
            Status = VehicleStatus.Active,
            IsVerified = false,
            CreatedAt = _dateTime.UtcNow
        };

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<VehicleDto>(vehicle);
        var driver = await _context.Drivers.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == request.DriverId, cancellationToken);
        if (driver != null) dto.DriverName = driver.User.FullName;

        return Result<VehicleDto>.Success(dto);
    }
}
