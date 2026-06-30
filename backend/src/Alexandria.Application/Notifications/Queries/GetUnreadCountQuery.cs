using MediatR;

namespace Alexandria.Application.Notifications.Queries;

public class GetUnreadCountQuery : IRequest<int>
{
    public string UserId { get; set; } = string.Empty;
}
