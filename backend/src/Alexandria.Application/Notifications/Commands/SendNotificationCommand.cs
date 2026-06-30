using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Notifications.Commands;

public class SendNotificationCommand : IRequest<Result>
{
    public string UserId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public object? Data { get; set; }
}
