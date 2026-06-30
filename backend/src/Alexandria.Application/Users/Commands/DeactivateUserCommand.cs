using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class DeactivateUserCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
