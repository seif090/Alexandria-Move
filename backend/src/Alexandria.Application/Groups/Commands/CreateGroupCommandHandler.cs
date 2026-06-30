using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Groups.Commands;

public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, Result<GroupDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public CreateGroupCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<GroupDto>> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<GroupType>(request.Type, true, out var type))
            return Result<GroupDto>.Failure("Invalid group type");

        var group = new TransportationGroup
        {
            Name = request.Name,
            Description = request.Description,
            Type = type.ToString(),
            CommunityId = request.CommunityId ?? Guid.Empty,
            RouteId = request.RouteId,
            DriverId = request.DriverId,
            Capacity = request.Capacity,
            AvailableSeats = request.Capacity,
            Price = request.Price.Value,
            DepartureTime = request.DepartureTime.Value,
            ArrivalTime = request.ArrivalTime,
            WorkingDays = string.Join(",", request.WorkingDays.Select(d => d.ToString())),
            Status = GroupStatus.Active,
            CreatedAt = _dateTime.UtcNow
        };

        _context.TransportationGroups.Add(group);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<GroupDto>(group);
        await PopulateRelatedNames(dto, cancellationToken);
        return Result<GroupDto>.Success(dto);
    }

    private async Task PopulateRelatedNames(GroupDto dto, CancellationToken cancellationToken)
    {
        if (dto.CommunityId.HasValue)
        {
            var community = await _context.Communities.FirstOrDefaultAsync(c => c.Id == dto.CommunityId, cancellationToken);
            if (community != null) dto.CommunityName = community.Name;
        }
        if (dto.RouteId.HasValue)
        {
            var route = await _context.Routes.FirstOrDefaultAsync(r => r.Id == dto.RouteId, cancellationToken);
            if (route != null) dto.RouteName = route.Name;
        }
        if (dto.DriverId.HasValue)
        {
            var driver = await _context.Drivers.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == dto.DriverId, cancellationToken);
            if (driver != null) dto.DriverName = driver.User.FullName;
        }
    }
}
