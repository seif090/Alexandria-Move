using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Commands;

public class UpdateBookingCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class UpdateBookingCommandHandler : IRequestHandler<UpdateBookingCommand, Result>
{
    public Task<Result> Handle(UpdateBookingCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
