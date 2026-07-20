using Application.Interfaces.Services;
using Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace Infrastructure.Services
{
    public class SupabaseStorageService : ISupabaseStorageService
    {
        private readonly HttpClient _httpClient;
        private readonly SupabaseOptions _options;

        public SupabaseStorageService(IHttpClientFactory httpClientFactory, IOptions<SupabaseOptions> options)
        {
            _httpClient = httpClientFactory.CreateClient("SupabaseStorage");
            _options = options.Value;
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string filePath, string contentType, CancellationToken cancellationToken = default)
        {
            using var content = new StreamContent(fileStream);
            content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            var response = await _httpClient.PostAsync($"object/{_options.Bucket}/{filePath}", content, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(cancellationToken);
                throw new Exception($"Tải file lên Supabase Storage thất bại: {error}");
            }

            return filePath;
        }

        public async Task<bool> DeleteFileAsync(string filePath, CancellationToken cancellationToken = default)
        {
            var response = await _httpClient.DeleteAsync($"object/{_options.Bucket}/{filePath}", cancellationToken);
            return response.IsSuccessStatusCode;
        }

        public string GetPublicUrl(string filePath)
        {
            return $"{_options.Url}/storage/v1/object/public/{_options.Bucket}/{filePath}";
        }

        public async Task<string> CreateSignedUrlAsync(string filePath, int expiresInSeconds, CancellationToken cancellationToken = default)
        {
            var payload = new { expiresIn = expiresInSeconds };
            var response = await _httpClient.PostAsJsonAsync($"object/sign/{_options.Bucket}/{filePath}", payload, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(cancellationToken);
                throw new Exception($"Tạo signed URL thất bại: {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<SignedUrlResponse>(cancellationToken: cancellationToken);
            return $"{_options.Url}/storage/v1{result?.SignedURL}";
        }

        private class SignedUrlResponse
        {
            public string SignedURL { get; set; } = string.Empty;
        }
    }
}
