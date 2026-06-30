using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public record AddCommunityMemberCommand : IRequest<Result>;

public class AddCommunityMemberCommandHandler : IRequestHandler<AddCommunityMemberCommand, Result>
{
    public Task<Result> Handle(AddCommunityMemberCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
