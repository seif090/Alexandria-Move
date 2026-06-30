using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Audit.Queries;

public class GetAuditLogsByUserQuery : IRequest<Result<object>>
{
    public Guid UserId { get; set; }
}

public class GetAuditLogsByUserQueryHandler : IRequestHandler<GetAuditLogsByUserQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetAuditLogsByUserQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
