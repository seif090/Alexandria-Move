using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Payments.Queries;

public record GetMyPaymentsQuery : IRequest<Result<object>>;

public class GetMyPaymentsQueryHandler : IRequestHandler<GetMyPaymentsQuery, Result<object>>
{
    public Task<Result<object>> Handle(GetMyPaymentsQuery request, CancellationToken cancellationToken)
        => Task.FromResult(Result<object>.Success(new object()));
}
