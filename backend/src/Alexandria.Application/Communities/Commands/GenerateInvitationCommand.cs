using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class GenerateInvitationCommand : IRequest<Result<string>>
{
    public Guid CommunityId { get; set; }
    public string? Email { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public int MaxUses { get; set; } = 1;
}
