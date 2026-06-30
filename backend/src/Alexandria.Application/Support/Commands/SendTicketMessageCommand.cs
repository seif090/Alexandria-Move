using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class SendTicketMessageCommand : IRequest<Result>
{    public Guid TicketId { get; set; }
}

public class SendTicketMessageCommandHandler : IRequestHandler<SendTicketMessageCommand, Result>
{
    public Task<Result> Handle(SendTicketMessageCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
