using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Notifications.Commands;

public class MarkAllNotificationsReadCommand : IRequest<Result>
{
}