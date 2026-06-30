using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Communities.Commands;

public class ApproveCommunityCommandHandler : IRequestHandler<ApproveCommunityCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public ApproveCommunityCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(ApproveCommunityCommand request, CancellationToken cancellationToken)
    {
        var community = await _context.Communities.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
        if (community == null) return Result.Failure("Community not found");

        community.IsApproved = true;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Community approved successfully");
    }
}
