using Alexandria.Domain.Enums;

namespace Alexandria.Application.Common.Interfaces;

public interface INotificationService
{
    Task SendAsync(string userId, NotificationType type, NotificationEvent @event, string title, string body, object? data = null);
    Task SendPushAsync(string deviceToken, string title, string body, object? data = null);
    Task SendEmailAsync(string email, string subject, string body);
    Task SendSmsAsync(string phoneNumber, string message);
    Task SendToRoleAsync(string role, NotificationType type, NotificationEvent @event, string title, string body, object? data = null);
}
