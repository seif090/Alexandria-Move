using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Groups.Commands;

public class DeleteGroupCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
