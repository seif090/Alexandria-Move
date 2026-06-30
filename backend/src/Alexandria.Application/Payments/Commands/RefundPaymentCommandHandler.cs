using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Payments.Commands;

public class RefundPaymentCommandHandler : IRequestHandler<RefundPaymentCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly IDateTime _dateTime;

    public RefundPaymentCommandHandler(IApplicationDbContext context, IPaymentService paymentService, IDateTime dateTime)
    {
        _context = context;
        _paymentService = paymentService;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(RefundPaymentCommand request, CancellationToken cancellationToken)
    {
        var payment = await _context.Payments.FirstOrDefaultAsync(p => p.Id == request.PaymentId, cancellationToken);
        if (payment == null) return Result.Failure("Payment not found");
        if (payment.Status == PaymentStatus.Refunded) return Result.Failure("Payment already refunded");

        var success = await _paymentService.RefundAsync(payment.TransactionId!);
        if (!success) return Result.Failure("Refund failed");

        payment.Status = PaymentStatus.Refunded;
        payment.RefundedAt = _dateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success("Payment refunded successfully");
    }
}
