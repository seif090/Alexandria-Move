using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Commands;

public class ApproveMemberCommandHandler : IRequestHandler<ApproveMemberCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public ApproveMemberCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(ApproveMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await _context.CommunityMembers
            .FirstOrDefaultAsync(m => m.CommunityId == request.CommunityId && m.UserId == request.UserId, cancellationToken);

        if (member == null) return Result.Failure("Member not found");

        member.Status = MemberStatus.Active;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Member approved successfully");
    }
}
