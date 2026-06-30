using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Bookings.Commands;

public record BulkCreateBookingsCommand : IRequest<Result>;

public class BulkCreateBookingsCommandHandler : IRequestHandler<BulkCreateBookingsCommand, Result>
{
    public Task<Result> Handle(BulkCreateBookingsCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
