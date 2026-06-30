using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class AddPassengerToTripCommand : IRequest<Result>
{    public Guid TripId { get; set; }
}

public class AddPassengerToTripCommandHandler : IRequestHandler<AddPassengerToTripCommand, Result>
{
    public Task<Result> Handle(AddPassengerToTripCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
