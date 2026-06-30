using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class ConfirmPassengerCommand : IRequest<Result>
{
    public Guid TripId { get; set; }
    public Guid UserId { get; set; }

    public Guid PassengerId { get; set; }
}