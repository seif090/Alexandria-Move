using Alexandria.Application.Common.Models;
using Alexandria.Application.Files.DTOs;
using MediatR;

namespace Alexandria.Application.Files.Commands;

public class UploadFileCommand : IRequest<Result<FileUploadDto>>
{
    public Stream FileStream { get; set; } = Stream.Null;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Container { get; set; } = string.Empty;
}
