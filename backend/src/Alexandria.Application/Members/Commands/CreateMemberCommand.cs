using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public record CreateMemberCommand : IRequest<Result>;

public class CreateMemberCommandHandler : IRequestHandler<CreateMemberCommand, Result>
{
    public Task<Result> Handle(CreateMemberCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
