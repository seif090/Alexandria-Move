using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Bookings.DTOs;

public class BookingDto : IMapFrom<Booking>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public BookingStatus Status { get; set; }
    public decimal? Amount { get; set; }
    public string? Notes { get; set; }
    public DateTime BookedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
}

public class CreateBookingDto
{
    public Guid GroupId { get; set; }
    public string? Notes { get; set; }
}
