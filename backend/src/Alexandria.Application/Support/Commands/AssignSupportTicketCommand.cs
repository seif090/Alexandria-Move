using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class AssignSupportTicketCommand : IRequest<Result>
{    public Guid TicketId { get; set; }
}

public class AssignSupportTicketCommandHandler : IRequestHandler<AssignSupportTicketCommand, Result>
{
    public Task<Result> Handle(AssignSupportTicketCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
