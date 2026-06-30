using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Files.Commands;

public class UpdateFileMetadataCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class UpdateFileMetadataCommandHandler : IRequestHandler<UpdateFileMetadataCommand, Result>
{
    public Task<Result> Handle(UpdateFileMetadataCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
