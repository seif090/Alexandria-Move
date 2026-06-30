using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.Notifications;

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(IApplicationDbContext context, IDateTime dateTime, ILogger<NotificationService> logger)
    {
        _context = context;
        _dateTime = dateTime;
        _logger = logger;
    }

    public async Task SendAsync(string userId, NotificationType type, NotificationEvent @event, string title, string body, object? data = null)
    {
        var notification = new Notification
        {
            UserId = Guid.Parse(userId),
            Type = type,
            Event = @event,
            Title = title,
            Body = body,
            Data = System.Text.Json.JsonSerializer.Serialize(data),
            SentAt = _dateTime.UtcNow
        };
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync(default);

        var user = await _context.Users.Include(u => u.Devices).FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));
        if (user?.Devices != null)
        {
            foreach (var device in user.Devices.Where(d => d.IsActive))
            {
                await SendPushAsync(device.DeviceToken, title, body, data);
            }
        }
    }

    public async Task SendPushAsync(string deviceToken, string title, string body, object? data = null)
    {
        _logger.LogInformation("Push notification sent to {DeviceToken}: {Title} - {Body}", deviceToken, title, body);
        await Task.CompletedTask;
    }

    public async Task SendEmailAsync(string email, string subject, string body)
    {
        _logger.LogInformation("Email sent to {Email}: {Subject}", email, subject);
        await Task.CompletedTask;
    }

    public async Task SendSmsAsync(string phoneNumber, string message)
    {
        _logger.LogInformation("SMS sent to {PhoneNumber}: {Message}", phoneNumber, message);
        await Task.CompletedTask;
    }

    public async Task SendToRoleAsync(string role, NotificationType type, NotificationEvent @event, string title, string body, object? data = null)
    {
        var userIds = await _context.UserRoles.Where(ur => ur.Role.Name == role).Select(ur => ur.UserId.ToString()).ToListAsync();
        foreach (var userId in userIds)
            await SendAsync(userId, type, @event, title, body, data);
    }
}
