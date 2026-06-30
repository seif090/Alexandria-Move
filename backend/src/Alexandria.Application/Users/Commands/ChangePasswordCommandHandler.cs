using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result>
{
    private readonly IIdentityService _identityService;

    public ChangePasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var success = await _identityService.ChangePasswordAsync(request.UserId, request.CurrentPassword, request.NewPassword);
        return success ? Result.Success("Password changed successfully") : Result.Failure("Failed to change password");
    }
}
