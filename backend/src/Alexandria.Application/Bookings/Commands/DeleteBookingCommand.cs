using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Commands;

public class DeleteBookingCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}