using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class UpdateMemberCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class UpdateMemberCommandHandler : IRequestHandler<UpdateMemberCommand, Result>
{
    public Task<Result> Handle(UpdateMemberCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
