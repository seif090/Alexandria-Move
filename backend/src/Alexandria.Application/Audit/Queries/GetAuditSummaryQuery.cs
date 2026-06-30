using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Audit.Queries;

public record GetAuditSummaryQuery : IRequest<Result<object>>;

public class GetAuditSummaryQueryHandler : IRequestHandler<GetAuditSummaryQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetAuditSummaryQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
