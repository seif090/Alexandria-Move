using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Groups.Commands;

public class AssignUsersToGroupCommand : IRequest<Result>
{    public Guid GroupId { get; set; }
}

public class AssignUsersToGroupCommandHandler : IRequestHandler<AssignUsersToGroupCommand, Result>
{
    public Task<Result> Handle(AssignUsersToGroupCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
