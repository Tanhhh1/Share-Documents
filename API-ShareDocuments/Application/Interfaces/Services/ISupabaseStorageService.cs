namespace Application.Interfaces.Services
{
    public interface ISupabaseStorageService
    {
        Task<string> UploadAsync(Stream fileStream, string filePath, string contentType, CancellationToken cancellationToken = default);
        Task<string> UpdateAsync(Stream fileStream, string filePath, string contentType, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(string filePath, CancellationToken cancellationToken = default);
        Task<(Stream Stream, string ContentType)> DownloadAsync(string filePath, CancellationToken cancellationToken = default);
        Task<bool> ExistsAsync(string filePath, CancellationToken cancellationToken = default);
        Task<string> GenerateSignedDownloadUrlAsync(string filePath, int expiresInSeconds, CancellationToken cancellationToken = default);
    }
}
