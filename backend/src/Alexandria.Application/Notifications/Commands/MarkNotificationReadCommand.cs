using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Notifications.Commands;

public class MarkNotificationReadCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}