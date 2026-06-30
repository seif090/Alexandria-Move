using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Members.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Commands;

public class AddMemberCommandHandler : IRequestHandler<AddMemberCommand, Result<MemberDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDateTime _dateTime;

    public AddMemberCommandHandler(IApplicationDbContext context, IMapper mapper, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _dateTime = dateTime;
    }

    public async Task<Result<MemberDto>> Handle(AddMemberCommand request, CancellationToken cancellationToken)
    {
        var community = await _context.Communities.FirstOrDefaultAsync(c => c.Id == request.CommunityId, cancellationToken);
        if (community == null) return Result<MemberDto>.Failure("Community not found");

        var existing = await _context.CommunityMembers.AnyAsync(m => m.CommunityId == request.CommunityId && m.UserId == request.UserId, cancellationToken);
        if (existing) return Result<MemberDto>.Failure("User is already a member");

        var currentCount = await _context.CommunityMembers.CountAsync(m => m.CommunityId == request.CommunityId, cancellationToken);
        if (currentCount >= community.MaxMembers) return Result<MemberDto>.Failure("Community has reached maximum members");

        var role = MemberRole.Member;
        if (!string.IsNullOrWhiteSpace(request.Role))
            Enum.TryParse<MemberRole>(request.Role, true, out role);

        var member = new CommunityMember
        {
            CommunityId = request.CommunityId,
            UserId = request.UserId,
            Role = role,
            Status = MemberStatus.Active,
            JoinedAt = _dateTime.UtcNow
        };

        _context.CommunityMembers.Add(member);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<MemberDto>(member);
        dto.CommunityName = community.Name;
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user != null)
        {
            dto.UserName = user.FullName;
            dto.UserEmail = user.Email;
            dto.UserProfileImageUrl = user.ProfileImageUrl;
        }

        return Result<MemberDto>.Success(dto);
    }
}
