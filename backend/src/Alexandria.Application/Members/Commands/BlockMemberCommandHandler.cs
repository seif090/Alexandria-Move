using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Commands;

public class BlockMemberCommandHandler : IRequestHandler<BlockMemberCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public BlockMemberCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(BlockMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await _context.CommunityMembers
            .FirstOrDefaultAsync(m => m.CommunityId == request.CommunityId && m.UserId == request.UserId, cancellationToken);

        if (member == null) return Result.Failure("Member not found");

        member.Status = MemberStatus.Blocked;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Member blocked successfully");
    }
}
