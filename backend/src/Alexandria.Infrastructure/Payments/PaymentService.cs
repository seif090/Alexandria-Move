using Alexandria.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Alexandria.Infrastructure.Payments;

public class PaymentService : IPaymentService
{
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(ILogger<PaymentService> logger)
    {
        _logger = logger;
    }

    public async Task<(bool Success, string TransactionId, string Message)> ProcessPaymentAsync(decimal amount, string currency, string paymentMethod, Dictionary<string, string> metadata)
    {
        _logger.LogInformation("Processing payment: {Amount} {Currency} via {Method}", amount, currency, paymentMethod);
        await Task.Delay(100);
        return (true, Guid.NewGuid().ToString(), "Payment processed successfully");
    }

    public async Task<bool> RefundAsync(string transactionId)
    {
        _logger.LogInformation("Refunding transaction: {TransactionId}", transactionId);
        await Task.Delay(100);
        return true;
    }

    public async Task<(bool Success, string Status)> CheckPaymentStatusAsync(string transactionId)
    {
        await Task.CompletedTask;
        return (true, "Completed");
    }
}
