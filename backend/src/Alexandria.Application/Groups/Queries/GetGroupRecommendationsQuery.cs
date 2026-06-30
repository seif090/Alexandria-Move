using Alexandria.Application.Groups.DTOs;
using MediatR;

namespace Alexandria.Application.Groups.Queries;

public class GetGroupRecommendationsQuery : IRequest<List<GroupDto>>
{
    public double? UserLatitude { get; set; }
    public double? UserLongitude { get; set; }
    public TimeSpan? PreferredTime { get; set; }
    public Guid? CommunityId { get; set; }
    public int MaxResults { get; set; } = 5;
}
