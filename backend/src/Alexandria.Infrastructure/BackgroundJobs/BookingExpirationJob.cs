using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.BackgroundJobs;

public class BookingExpirationJob
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;
    private readonly ILogger<BookingExpirationJob> _logger;
    private readonly INotificationService _notificationService;

    public BookingExpirationJob(IApplicationDbContext context, IDateTime dateTime, ILogger<BookingExpirationJob> logger, INotificationService notificationService)
    {
        _context = context;
        _dateTime = dateTime;
        _logger = logger;
        _notificationService = notificationService;
    }

    public async Task ExpirePendingBookingsAsync()
    {
        var cutoff = _dateTime.UtcNow.AddHours(-24);
        var expiredBookings = await _context.Bookings
            .Where(b => b.Status == BookingStatus.Pending && b.CreatedAt <= cutoff)
            .ToListAsync();

        foreach (var booking in expiredBookings)
        {
            booking.Status = BookingStatus.Expired;
            await _notificationService.SendAsync(
                booking.UserId.ToString(),
                NotificationType.InApp,
                NotificationEvent.BookingConfirmation,
                "Booking Expired",
                $"Your booking for {booking.Group?.Name ?? "group"} has expired"
            );
        }

        await _context.SaveChangesAsync(default);
        _logger.LogInformation("Expired {Count} pending bookings", expiredBookings.Count);
    }
}
