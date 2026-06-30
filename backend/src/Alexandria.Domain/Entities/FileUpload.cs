namespace Alexandria.Domain.Entities;

public class FileUpload : BaseEntity
{
    public string FileName { get; set; } = string.Empty;
    public string OriginalName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long Size { get; set; }
    public string Path { get; set; } = string.Empty;
    public string? ContainerName { get; set; }
    public Guid UploadedById { get; set; }
    public virtual User UploadedBy { get; set; } = null!;
    public string? EntityType { get; set; }
    public string? EntityId { get; set; }
}
