using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class UpdateTripCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class UpdateTripCommandHandler : IRequestHandler<UpdateTripCommand, Result>
{
    public Task<Result> Handle(UpdateTripCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
