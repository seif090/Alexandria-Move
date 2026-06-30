using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Payments.Commands;

public class VoidPaymentCommand : IRequest<Result>
{
    public Guid PaymentId { get; set; }
}