using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class VerifyUserCommandHandler : IRequestHandler<VerifyUserCommand, Result>
{
    private readonly IIdentityService _identityService;

    public VerifyUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(VerifyUserCommand request, CancellationToken cancellationToken)
    {
        var success = await _identityService.VerifyEmailAsync(request.UserId, request.Token);
        return success ? Result.Success("Email verified successfully") : Result.Failure("Email verification failed");
    }
}
