using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using MediatR;

namespace Alexandria.Application.Communities.Queries;

public class GetCommunitiesQuery : SearchRequest, IRequest<PaginatedList<CommunityDto>>
{
    public string? Type { get; set; }
    public string? City { get; set; }
    public string? Area { get; set; }
    public bool? IsApproved { get; set; }
    public bool? IsActive { get; set; }
}
