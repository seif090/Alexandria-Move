using Alexandria.Application.Files.DTOs;
using MediatR;

namespace Alexandria.Application.Files.Queries;

public class DownloadFileQuery : IRequest<FileDownloadDto?>
{
    public Guid Id { get; set; }
}