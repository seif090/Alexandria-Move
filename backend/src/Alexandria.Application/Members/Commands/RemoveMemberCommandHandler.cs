using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Commands;

public class RemoveMemberCommandHandler : IRequestHandler<RemoveMemberCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public RemoveMemberCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(RemoveMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await _context.CommunityMembers
            .FirstOrDefaultAsync(m => m.CommunityId == request.CommunityId && m.UserId == request.UserId, cancellationToken);

        if (member == null) return Result.Failure("Member not found");

        _context.CommunityMembers.Remove(member);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Member removed successfully");
    }
}
