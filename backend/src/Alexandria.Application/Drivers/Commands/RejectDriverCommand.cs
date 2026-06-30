using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Drivers.Commands;

public class RejectDriverCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class RejectDriverCommandHandler : IRequestHandler<RejectDriverCommand, Result>
{
    public Task<Result> Handle(RejectDriverCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
