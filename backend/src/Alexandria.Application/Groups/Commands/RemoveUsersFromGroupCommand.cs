using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Groups.Commands;

public class RemoveUsersFromGroupCommand : IRequest<Result>
{    public Guid GroupId { get; set; }
}

public class RemoveUsersFromGroupCommandHandler : IRequestHandler<RemoveUsersFromGroupCommand, Result>
{
    public Task<Result> Handle(RemoveUsersFromGroupCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
