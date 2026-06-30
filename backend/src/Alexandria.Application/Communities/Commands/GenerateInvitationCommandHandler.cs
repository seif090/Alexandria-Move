using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Communities.Commands;

public class GenerateInvitationCommandHandler : IRequestHandler<GenerateInvitationCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;

    public GenerateInvitationCommandHandler(IApplicationDbContext context, IDateTime dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result<string>> Handle(GenerateInvitationCommand request, CancellationToken cancellationToken)
    {
        var community = await _context.Communities.AnyAsync(c => c.Id == request.CommunityId, cancellationToken);
        if (!community) return Result<string>.Failure("Community not found");

        var token = Guid.NewGuid().ToString("N");
        var invitation = new CommunityInvitation
        {
            CommunityId = request.CommunityId,
            Token = token,
            Email = request.Email,
            ExpiresAt = request.ExpiresAt ?? _dateTime.UtcNow.AddDays(7),
            MaxUses = request.MaxUses,
            UsedCount = 0,
            CreatedAt = _dateTime.UtcNow
        };

        _context.CommunityInvitations.Add(invitation);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<string>.Success(token, "Invitation generated successfully");
    }
}
