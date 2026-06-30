using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Groups.Queries;

public class GetGroupByIdQueryHandler : IRequestHandler<GetGroupByIdQuery, Result<GroupDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetGroupByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<GroupDto>> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
    {
        var group = await _context.TransportationGroups
            .Include(g => g.Community)
            .Include(g => g.Route)
            .Include(g => g.Driver).ThenInclude(d => d.User)
            .FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);

        if (group == null) return Result<GroupDto>.Failure("Group not found");

        return Result<GroupDto>.Success(_mapper.Map<GroupDto>(group));
    }
}
