using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Stops.Commands;

public record BatchReorderStopsCommand : IRequest<Result>;

public class BatchReorderStopsCommandHandler : IRequestHandler<BatchReorderStopsCommand, Result>
{
    public Task<Result> Handle(BatchReorderStopsCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
