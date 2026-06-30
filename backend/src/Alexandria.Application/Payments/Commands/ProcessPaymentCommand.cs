using Alexandria.Application.Common.Models;
using Alexandria.Application.Payments.DTOs;
using MediatR;

namespace Alexandria.Application.Payments.Commands;

public class ProcessPaymentCommand : IRequest<Result<PaymentDto>>
{
    public Guid? BookingId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public string PaymentMethod { get; set; } = string.Empty;
    public Dictionary<string, string> Metadata { get; set; } = new();
}
