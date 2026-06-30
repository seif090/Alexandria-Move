using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class RemovePassengerFromTripCommand : IRequest<Result>
{
    public Guid TripId { get; set; }
    public Guid PassengerId { get; set; }
}