using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class SuspendMemberCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}