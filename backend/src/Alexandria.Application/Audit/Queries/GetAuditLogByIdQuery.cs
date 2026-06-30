using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Audit.Queries;

public class GetAuditLogByIdQuery : IRequest<Result<object>>
{
    public Guid Id { get; set; }
}