using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Queries;

public record GetSupportTicketsQuery : IRequest<Result<object>>;

public class GetSupportTicketsQueryHandler : IRequestHandler<GetSupportTicketsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetSupportTicketsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
