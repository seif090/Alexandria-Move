using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Members.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Queries;

public class GetMemberByIdQueryHandler : IRequestHandler<GetMemberByIdQuery, Result<MemberDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMemberByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<MemberDto>> Handle(GetMemberByIdQuery request, CancellationToken cancellationToken)
    {
        var member = await _context.CommunityMembers
            .Include(m => m.User)
            .Include(m => m.Community)
            .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);

        if (member == null) return Result<MemberDto>.Failure("Member not found");

        return Result<MemberDto>.Success(_mapper.Map<MemberDto>(member));
    }
}
