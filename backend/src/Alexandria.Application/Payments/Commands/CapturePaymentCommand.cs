using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Payments.Commands;

public class CapturePaymentCommand : IRequest<Result>
{
    public Guid PaymentId { get; set; }
}