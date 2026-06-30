using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Payments.Commands;

public record PaymentWebhookCommand : IRequest<Result>;

public class PaymentWebhookCommandHandler : IRequestHandler<PaymentWebhookCommand, Result>
{
    public Task<Result> Handle(PaymentWebhookCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
