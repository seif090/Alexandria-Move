using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class BulkDeleteMembersCommand : IRequest<Result>
{
    public Guid CommunityId { get; set; }
    public List<Guid> UserIds { get; set; } = new();
}
