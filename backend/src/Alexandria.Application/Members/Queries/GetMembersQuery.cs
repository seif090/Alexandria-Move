using Alexandria.Application.Common.Models;
using Alexandria.Application.Members.DTOs;
using MediatR;

namespace Alexandria.Application.Members.Queries;

public class GetMembersQuery : SearchRequest, IRequest<PaginatedList<MemberDto>>
{
    public Guid? CommunityId { get; set; }
    public string? Status { get; set; }
    public string? Role { get; set; }
}
