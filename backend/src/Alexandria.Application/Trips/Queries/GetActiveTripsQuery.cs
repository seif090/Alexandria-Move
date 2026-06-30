using Alexandria.Application.Trips.DTOs;
using MediatR;

namespace Alexandria.Application.Trips.Queries;

public class GetActiveTripsQuery : IRequest<List<TripDto>>
{
    public Guid? DriverId { get; set; }
}
