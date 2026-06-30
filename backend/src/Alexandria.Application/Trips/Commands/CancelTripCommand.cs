using Alexandria.Application.Common.Models;
using Alexandria.Application.Trips.DTOs;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class CancelTripCommand : IRequest<Result<TripDto>>
{
    public Guid TripId { get; set; }
    public string? Reason { get; set; }

    public Guid Id { get; set; }
}