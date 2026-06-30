using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class DeleteTripCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}