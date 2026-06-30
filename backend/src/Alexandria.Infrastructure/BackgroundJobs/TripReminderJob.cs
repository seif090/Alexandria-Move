using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.BackgroundJobs;

public class TripReminderJob
{
    private readonly IApplicationDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IDateTime _dateTime;
    private readonly ILogger<TripReminderJob> _logger;

    public TripReminderJob(IApplicationDbContext context, INotificationService notificationService, IDateTime dateTime, ILogger<TripReminderJob> logger)
    {
        _context = context;
        _notificationService = notificationService;
        _dateTime = dateTime;
        _logger = logger;
    }

    public async Task SendTripRemindersAsync()
    {
        var upcomingTrips = await _context.Trips
            .Include(t => t.Group)
            .ThenInclude(g => g.Bookings)
            .ThenInclude(b => b.User)
            .Where(t => t.Status == TripStatus.Scheduled && t.ScheduledDate > _dateTime.UtcNow && t.ScheduledDate <= _dateTime.UtcNow.AddHours(2))
            .ToListAsync();

        foreach (var trip in upcomingTrips)
        {
            foreach (var booking in trip.Group.Bookings.Where(b => b.Status == BookingStatus.Approved))
            {
                await _notificationService.SendAsync(
                    booking.UserId.ToString(),
                    NotificationType.Push,
                    NotificationEvent.TripReminder,
                    "Trip Reminder",
                    $"Your trip {trip.Group.Name} is scheduled at {trip.ScheduledDate:T}",
                    new { tripId = trip.Id, groupId = trip.GroupId }
                );
            }
        }

        _logger.LogInformation("Sent {Count} trip reminders", upcomingTrips.Count);
    }
}
