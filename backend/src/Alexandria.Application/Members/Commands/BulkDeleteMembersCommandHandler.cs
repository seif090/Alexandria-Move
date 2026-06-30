using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Commands;

public class BulkDeleteMembersCommandHandler : IRequestHandler<BulkDeleteMembersCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public BulkDeleteMembersCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(BulkDeleteMembersCommand request, CancellationToken cancellationToken)
    {
        var members = await _context.CommunityMembers
            .Where(m => m.CommunityId == request.CommunityId && request.UserIds.Contains(m.UserId))
            .ToListAsync(cancellationToken);

        _context.CommunityMembers.RemoveRange(members);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success($"{members.Count} members deleted successfully");
    }
}
