using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Queries;

public record GetMySupportTicketsQuery : IRequest<Result<object>>;

public class GetMySupportTicketsQueryHandler : IRequestHandler<GetMySupportTicketsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetMySupportTicketsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
