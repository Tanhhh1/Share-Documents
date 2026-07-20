namespace Application.Interfaces.Services
{
    public interface ISupabaseStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string filePath, string contentType, CancellationToken cancellationToken = default);
        Task<bool> DeleteFileAsync(string filePath, CancellationToken cancellationToken = default);
        string GetPublicUrl(string filePath);
        Task<string> CreateSignedUrlAsync(string filePath, int expiresInSeconds, CancellationToken cancellationToken = default);
    }
}
