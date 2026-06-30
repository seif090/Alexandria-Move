using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Files.Commands;

public record UploadMultipleFilesCommand : IRequest<Result>;

public class UploadMultipleFilesCommandHandler : IRequestHandler<UploadMultipleFilesCommand, Result>
{
    public Task<Result> Handle(UploadMultipleFilesCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
