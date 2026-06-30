using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Commands;

public class UpdateDriverCommandHandler : IRequestHandler<UpdateDriverCommand, Result<DriverDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateDriverCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<DriverDto>> Handle(UpdateDriverCommand request, CancellationToken cancellationToken)
    {
        var driver = await _context.Drivers.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);
        if (driver == null) return Result<DriverDto>.Failure("Driver not found");

        if (request.LicenseNumber != null) driver.LicenseNumber = request.LicenseNumber;
        if (request.LicenseExpiryDate.HasValue) driver.LicenseExpiryDate = request.LicenseExpiryDate.Value;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<DriverDto>(driver);
        dto.FullName = driver.User.FullName;
        dto.Email = driver.User.Email;
        dto.PhoneNumber = driver.User.PhoneNumber;
        dto.ProfileImageUrl = driver.User.ProfileImageUrl;

        return Result<DriverDto>.Success(dto);
    }
}
