using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Commands;

public class CreateDriverCommandHandler : IRequestHandler<CreateDriverCommand, Result<DriverDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public CreateDriverCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<DriverDto>> Handle(CreateDriverCommand request, CancellationToken cancellationToken)
    {
        var existing = await _context.Drivers.AnyAsync(d => d.UserId == request.UserId, cancellationToken);
        if (existing) return Result<DriverDto>.Failure("User is already a driver");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user == null) return Result<DriverDto>.Failure("User not found");

        var driver = new Driver
        {
            UserId = request.UserId,
            LicenseNumber = request.LicenseNumber,
            LicenseExpiryDate = request.LicenseExpiryDate.Value,
            Status = DriverStatus.Pending,
            IsVerified = false,
            CreatedAt = _dateTime.UtcNow
        };

        _context.Drivers.Add(driver);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<DriverDto>(driver);
        dto.FullName = user.FullName;
        dto.Email = user.Email;
        dto.PhoneNumber = user.PhoneNumber;
        dto.ProfileImageUrl = user.ProfileImageUrl;

        return Result<DriverDto>.Success(dto);
    }
}
