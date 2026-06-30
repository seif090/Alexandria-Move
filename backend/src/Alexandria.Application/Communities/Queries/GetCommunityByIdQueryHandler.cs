using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Communities.Queries;

public class GetCommunityByIdQueryHandler : IRequestHandler<GetCommunityByIdQuery, Result<CommunityDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCommunityByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<CommunityDto>> Handle(GetCommunityByIdQuery request, CancellationToken cancellationToken)
    {
        var community = await _context.Communities
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (community == null) return Result<CommunityDto>.Failure("Community not found");

        var dto = _mapper.Map<CommunityDto>(community);
        dto.MemberCount = await _context.CommunityMembers.CountAsync(cm => cm.CommunityId == community.Id, cancellationToken);
        return Result<CommunityDto>.Success(dto);
    }
}
