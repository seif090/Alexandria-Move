using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class ChangePasswordCommand : IRequest<Result>
{
    public string UserId { get; set; } = string.Empty;
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
