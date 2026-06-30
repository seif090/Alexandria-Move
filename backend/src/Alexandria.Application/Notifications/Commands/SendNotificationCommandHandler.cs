using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using MediatR;

namespace Alexandria.Application.Notifications.Commands;

public class SendNotificationCommandHandler : IRequestHandler<SendNotificationCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IDateTime _dateTime;

    public SendNotificationCommandHandler(IApplicationDbContext context, INotificationService notificationService, IDateTime dateTime)
    {
        _context = context;
        _notificationService = notificationService;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(SendNotificationCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<NotificationEvent>(request.Type, true, out var eventType))
            return Result.Failure("Invalid notification type");

        var notification = new Notification
        {
            UserId = Guid.Parse(request.UserId),
            Title = request.Title,
            Body = request.Body,
            IsRead = false,
            CreatedAt = _dateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync(cancellationToken);

        await _notificationService.SendAsync(
            request.UserId,
            NotificationType.Push,
            eventType,
            request.Title,
            request.Body,
            request.Data);

        return Result.Success("Notification sent successfully");
    }
}
