using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Files.Commands;

public class DeleteFileCommandHandler : IRequestHandler<DeleteFileCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public DeleteFileCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task<Result> Handle(DeleteFileCommand request, CancellationToken cancellationToken)
    {
        var file = await _context.FileUploads.FirstOrDefaultAsync(f => f.Id == request.Id, cancellationToken);
        if (file == null) return Result.Failure("File not found");

        await _fileService.DeleteAsync(file.Path, file.ContainerName);
        _context.FileUploads.Remove(file);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success("File deleted successfully");
    }
}
