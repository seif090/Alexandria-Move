namespace Alexandria.Application.Common.Interfaces;

public interface IPaymentService
{
    Task<(bool Success, string TransactionId, string Message)> ProcessPaymentAsync(decimal amount, string currency, string paymentMethod, Dictionary<string, string> metadata);
    Task<bool> RefundAsync(string transactionId);
    Task<(bool Success, string Status)> CheckPaymentStatusAsync(string transactionId);
}
