using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class MarkPassengerNoShowCommand : IRequest<Result>
{
    public Guid TripId { get; set; }
    public Guid PassengerId { get; set; }
}