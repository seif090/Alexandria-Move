using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class DeleteCommunityCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
