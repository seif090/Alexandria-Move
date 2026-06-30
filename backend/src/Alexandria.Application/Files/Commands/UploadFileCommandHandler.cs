using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Files.DTOs;
using Alexandria.Domain.Entities;
using AutoMapper;
using MediatR;

namespace Alexandria.Application.Files.Commands;

public class UploadFileCommandHandler : IRequestHandler<UploadFileCommand, Result<FileUploadDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IFileService _fileService;
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;

    public UploadFileCommandHandler(IApplicationDbContext context, IMapper mapper, IFileService fileService, ICurrentUserService currentUser, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _fileService = fileService;
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    public async Task<Result<FileUploadDto>> Handle(UploadFileCommand request, CancellationToken cancellationToken)
    {
        var url = await _fileService.UploadAsync(request.FileStream, request.FileName, request.ContentType, request.Container);

        var fileUpload = new FileUpload
        {
            FileName = request.FileName,
            OriginalName = request.FileName,
            ContentType = request.ContentType,
            Size = request.FileStream.Length,
            Path = url,
            UploadedById = Guid.Parse(_currentUser.UserId!)
        };

        if (!string.IsNullOrEmpty(request.Container))
            fileUpload.ContainerName = request.Container;

        _context.FileUploads.Add(fileUpload);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<FileUploadDto>.Success(_mapper.Map<FileUploadDto>(fileUpload));
    }
}
