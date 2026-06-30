using Alexandria.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Alexandria.Infrastructure.Files;

public class FileService : IFileService
{
    private readonly string _storagePath;

    public FileService(IConfiguration configuration)
    {
        _storagePath = configuration["FileStorage:Path"] ?? Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        if (!Directory.Exists(_storagePath)) Directory.CreateDirectory(_storagePath);
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string container)
    {
        var containerPath = Path.Combine(_storagePath, container);
        if (!Directory.Exists(containerPath)) Directory.CreateDirectory(containerPath);

        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(containerPath, uniqueFileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await fileStream.CopyToAsync(stream);

        return $"/uploads/{container}/{uniqueFileName}";
    }

    public async Task<bool> DeleteAsync(string fileUrl, string container)
    {
        var fileName = Path.GetFileName(fileUrl);
        var filePath = Path.Combine(_storagePath, container, fileName);
        if (File.Exists(filePath))
        {
            await Task.Run(() => File.Delete(filePath));
            return true;
        }
        return false;
    }

    public async Task<Stream?> GetAsync(string fileUrl, string container)
    {
        var fileName = Path.GetFileName(fileUrl);
        var filePath = Path.Combine(_storagePath, container, fileName);
        if (!File.Exists(filePath)) return null;
        return await Task.Run(() => new FileStream(filePath, FileMode.Open, FileAccess.Read) as Stream);
    }

    public string GetFileUrl(string fileName, string container)
    {
        return $"/uploads/{container}/{fileName}";
    }
}
