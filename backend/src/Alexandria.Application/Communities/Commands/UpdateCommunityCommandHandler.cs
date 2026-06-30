using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Communities.Commands;

public class UpdateCommunityCommandHandler : IRequestHandler<UpdateCommunityCommand, Result<CommunityDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateCommunityCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<CommunityDto>> Handle(UpdateCommunityCommand request, CancellationToken cancellationToken)
    {
        var community = await _context.Communities.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
        if (community == null) return Result<CommunityDto>.Failure("Community not found");

        if (request.Name != null) community.Name = request.Name;
        if (request.Description != null) community.Description = request.Description;
        if (request.LogoUrl != null) community.LogoUrl = request.LogoUrl;
        if (request.City != null) community.City = request.City;
        if (request.Area != null) community.Area = request.Area;
        if (request.MaxMembers.HasValue) community.MaxMembers = request.MaxMembers.Value;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<CommunityDto>(community);
        dto.MemberCount = await _context.CommunityMembers.CountAsync(cm => cm.CommunityId == community.Id, cancellationToken);
        return Result<CommunityDto>.Success(dto);
    }
}
