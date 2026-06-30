using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class UpdateSupportTicketCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class UpdateSupportTicketCommandHandler : IRequestHandler<UpdateSupportTicketCommand, Result>
{
    public Task<Result> Handle(UpdateSupportTicketCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
