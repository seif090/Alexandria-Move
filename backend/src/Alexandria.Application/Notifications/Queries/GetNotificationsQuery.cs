using Alexandria.Application.Common.Models;
using Alexandria.Application.Notifications.DTOs;
using MediatR;

namespace Alexandria.Application.Notifications.Queries;

public class GetNotificationsQuery : IRequest<PaginatedList<NotificationDto>>
{
    public string UserId { get; set; } = string.Empty;
    public bool? IsRead { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
