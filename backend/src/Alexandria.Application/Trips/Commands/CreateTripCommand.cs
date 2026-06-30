using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public record CreateTripCommand : IRequest<Result>;

public class CreateTripCommandHandler : IRequestHandler<CreateTripCommand, Result>
{
    public Task<Result> Handle(CreateTripCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
