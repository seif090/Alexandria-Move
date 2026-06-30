namespace Alexandria.Application.Common.Interfaces;

public interface IFileService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string container);
    Task<bool> DeleteAsync(string fileUrl, string container);
    Task<Stream?> GetAsync(string fileUrl, string container);
    string GetFileUrl(string fileName, string container);
}
