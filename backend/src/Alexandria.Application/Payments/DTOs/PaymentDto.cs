using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Payments.DTOs;

public class PaymentDto : IMapFrom<Payment>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid? BookingId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime PaidAt { get; set; }
    public DateTime? RefundedAt { get; set; }
}

public class CreatePaymentDto
{
    public Guid? BookingId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public string PaymentMethod { get; set; } = string.Empty;
}
