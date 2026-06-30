using Alexandria.Application.Common.Models;
using Alexandria.Application.Trips.DTOs;
using MediatR;

namespace Alexandria.Application.Trips.Queries;

public class GetTripByIdQuery : IRequest<Result<TripDto>>
{
    public Guid Id { get; set; }
}
