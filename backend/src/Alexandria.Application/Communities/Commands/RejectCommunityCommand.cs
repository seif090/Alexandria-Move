using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class RejectCommunityCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class RejectCommunityCommandHandler : IRequestHandler<RejectCommunityCommand, Result>
{
    public Task<Result> Handle(RejectCommunityCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
