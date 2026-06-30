using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Audit.Queries;

public class GetAuditLogsByEntityQuery : IRequest<Result<object>>
{
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
}

public class GetAuditLogsByEntityQueryHandler : IRequestHandler<GetAuditLogsByEntityQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetAuditLogsByEntityQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
