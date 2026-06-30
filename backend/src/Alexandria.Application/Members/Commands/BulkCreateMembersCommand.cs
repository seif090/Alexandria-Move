using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public record BulkCreateMembersCommand : IRequest<Result>;

public class BulkCreateMembersCommandHandler : IRequestHandler<BulkCreateMembersCommand, Result>
{
    public Task<Result> Handle(BulkCreateMembersCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
