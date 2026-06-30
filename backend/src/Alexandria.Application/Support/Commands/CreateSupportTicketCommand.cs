using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public record CreateSupportTicketCommand : IRequest<Result>;

public class CreateSupportTicketCommandHandler : IRequestHandler<CreateSupportTicketCommand, Result>
{
    public Task<Result> Handle(CreateSupportTicketCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
