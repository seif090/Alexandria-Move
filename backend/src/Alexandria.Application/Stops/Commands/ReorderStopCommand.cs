using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Stops.Commands;

public class ReorderStopCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class ReorderStopCommandHandler : IRequestHandler<ReorderStopCommand, Result>
{
    public Task<Result> Handle(ReorderStopCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
