using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class ImportMembersCommand : IRequest<Result>
{
    public object File { get; set; } = null!;
}