using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Groups.Commands;

public class UpdateGroupCommandHandler : IRequestHandler<UpdateGroupCommand, Result<GroupDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateGroupCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<GroupDto>> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.TransportationGroups.FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);
        if (group == null) return Result<GroupDto>.Failure("Group not found");

        if (request.Name != null) group.Name = request.Name;
        if (request.Description != null) group.Description = request.Description;
        if (request.Type != null && Enum.TryParse<GroupType>(request.Type, true, out var type)) group.Type = type.ToString();
        if (request.RouteId.HasValue) group.RouteId = request.RouteId;
        if (request.DriverId.HasValue) group.DriverId = request.DriverId;
        if (request.Capacity.HasValue) { group.Capacity = request.Capacity.Value; group.AvailableSeats = request.Capacity.Value; }
        if (request.Price.HasValue) group.Price = request.Price.Value;
        if (request.DepartureTime.HasValue) group.DepartureTime = request.DepartureTime.Value;
        if (request.ArrivalTime.HasValue) group.ArrivalTime = request.ArrivalTime;
        if (request.WorkingDays != null) group.WorkingDays = string.Join(",", request.WorkingDays.Select(d => d.ToString()));

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<GroupDto>(group);
        return Result<GroupDto>.Success(dto);
    }
}
