using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;

namespace Alexandria.Application.Files.DTOs;

public class FileUploadDto : IMapFrom<FileUpload>
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long Size { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Container { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}
