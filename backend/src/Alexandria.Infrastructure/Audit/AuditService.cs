using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Infrastructure.Audit;

public class AuditService : IAuditService
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;

    public AuditService(IApplicationDbContext context, IDateTime dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task LogAsync(string userId, string action, string entityType, string entityId, string? oldValues, string? newValues, string? affectedFields, string? ipAddress)
    {
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = string.IsNullOrEmpty(userId) ? null : Guid.Parse(userId),
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            OldValues = oldValues,
            NewValues = newValues,
            AffectedFields = affectedFields,
            IpAddress = ipAddress ?? "0.0.0.0",
            Timestamp = _dateTime.UtcNow
        });
        await _context.SaveChangesAsync(default);
    }

    public async Task LogLoginAsync(string userId, string ipAddress, bool success, string? failureReason = null)
    {
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = string.IsNullOrEmpty(userId) ? null : Guid.Parse(userId),
            Action = success ? "LoginSuccess" : "LoginFailed",
            EntityType = "User",
            EntityId = userId,
            IpAddress = ipAddress,
            OldValues = null,
            NewValues = failureReason,
            AffectedFields = null,
            Timestamp = _dateTime.UtcNow
        });
        await _context.SaveChangesAsync(default);
    }
}
