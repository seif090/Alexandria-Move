using MediatR;

namespace Alexandria.Application.Audit.Queries;

public record ExportAuditLogsQuery : IRequest<byte[]>;

public class ExportAuditLogsQueryHandler : IRequestHandler<ExportAuditLogsQuery, byte[]>
{
    public Task<byte[]> Handle(ExportAuditLogsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Array.Empty<byte>());
}
