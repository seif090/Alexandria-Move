using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Roles.Commands;

public class UpdateRolePermissionsCommand : IRequest<Result>
{    public Guid RoleId { get; set; }
}

public class UpdateRolePermissionsCommandHandler : IRequestHandler<UpdateRolePermissionsCommand, Result>
{
    public Task<Result> Handle(UpdateRolePermissionsCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
