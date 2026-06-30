using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Result>
{
    private readonly IIdentityService _identityService;

    public ResetPasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var success = await _identityService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
        return success ? Result.Success("Password reset successfully") : Result.Failure("Failed to reset password");
    }
}
