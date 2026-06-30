namespace Alexandria.Application.Common.Interfaces;

public interface IAuditService
{
    Task LogAsync(string userId, string action, string entityType, string entityId, string? oldValues, string? newValues, string? affectedFields, string? ipAddress);
    Task LogLoginAsync(string userId, string ipAddress, bool success, string? failureReason = null);
}
