using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Queries;

public class GetTripPassengersQuery : IRequest<Result<object>>
{
    public Guid TripId { get; set; }
}