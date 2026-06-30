using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Commands;

public class BulkActivateMembersCommandHandler : IRequestHandler<BulkActivateMembersCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public BulkActivateMembersCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(BulkActivateMembersCommand request, CancellationToken cancellationToken)
    {
        var members = await _context.CommunityMembers
            .Where(m => m.CommunityId == request.CommunityId && request.UserIds.Contains(m.UserId))
            .ToListAsync(cancellationToken);

        foreach (var member in members)
            member.Status = MemberStatus.Active;

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success($"{members.Count} members activated successfully");
    }
}
