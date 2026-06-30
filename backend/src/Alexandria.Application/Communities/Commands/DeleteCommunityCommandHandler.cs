using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Communities.Commands;

public class DeleteCommunityCommandHandler : IRequestHandler<DeleteCommunityCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public DeleteCommunityCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(DeleteCommunityCommand request, CancellationToken cancellationToken)
    {
        var community = await _context.Communities
            .Include(c => c.Members)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (community == null) return Result.Failure("Community not found");

        _context.CommunityMembers.RemoveRange(community.Members);
        _context.Communities.Remove(community);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Community deleted successfully");
    }
}
