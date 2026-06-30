using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using Alexandria.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Groups.Commands;

public class CloneGroupCommandHandler : IRequestHandler<CloneGroupCommand, Result<GroupDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public CloneGroupCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<GroupDto>> Handle(CloneGroupCommand request, CancellationToken cancellationToken)
    {
        var source = await _context.TransportationGroups.FirstOrDefaultAsync(g => g.Id == request.SourceGroupId, cancellationToken);
        if (source == null) return Result<GroupDto>.Failure("Source group not found");

        var clone = new TransportationGroup
        {
            Name = request.NewName,
            Description = source.Description,
            Type = source.Type,
            CommunityId = source.CommunityId,
            RouteId = source.RouteId,
            DriverId = source.DriverId,
            Capacity = source.Capacity,
            AvailableSeats = source.Capacity,
            Price = source.Price,
            DepartureTime = source.DepartureTime,
            ArrivalTime = source.ArrivalTime,
            WorkingDays = source.WorkingDays,
            Status = source.Status,
            CreatedAt = _dateTime.UtcNow
        };

        _context.TransportationGroups.Add(clone);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<GroupDto>.Success(_mapper.Map<GroupDto>(clone));
    }
}
