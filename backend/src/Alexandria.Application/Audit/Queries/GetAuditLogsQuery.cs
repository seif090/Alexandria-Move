using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Audit.Queries;

public record GetAuditLogsQuery : IRequest<Result<object>>;

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
