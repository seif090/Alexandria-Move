using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Drivers.Queries;

public class GetDriverByIdQueryHandler : IRequestHandler<GetDriverByIdQuery, Result<DriverDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDriverByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<DriverDto>> Handle(GetDriverByIdQuery request, CancellationToken cancellationToken)
    {
        var driver = await _context.Drivers
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (driver == null) return Result<DriverDto>.Failure("Driver not found");

        return Result<DriverDto>.Success(_mapper.Map<DriverDto>(driver));
    }
}
