using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Roles.Commands;

public class DeleteRoleCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
