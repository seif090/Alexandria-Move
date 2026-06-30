using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class VerifyUserCommand : IRequest<Result>
{
    public string UserId { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public Guid Id { get; set; }
}