using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class ActivateUserCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
