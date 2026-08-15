using Application.Interfaces.Services;
using PDFtoImage;
using SkiaSharp;

namespace Infrastructure.Services
{
    public class GotenbergConvertService : IDocumentConvertService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public GotenbergConvertService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<Stream> ConvertPdfAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
        {
            var client = _httpClientFactory.CreateClient("Gotenberg");

            using var content = new MultipartFormDataContent();
            var fileContent = new StreamContent(fileStream);
            content.Add(fileContent, "files", fileName);

            using var response = await client.PostAsync("forms/libreoffice/convert", content, cancellationToken);
            response.EnsureSuccessStatusCode();

            var pdfStream = new MemoryStream();
            await response.Content.CopyToAsync(pdfStream, cancellationToken);
            pdfStream.Position = 0;
            return pdfStream;
        }

        public Task<Stream> GenerateThumbnailAsync(Stream pdfStream, CancellationToken cancellationToken = default)
        {
            using var pdfMemory = new MemoryStream();
            pdfStream.CopyTo(pdfMemory);
            var pdfBytes = pdfMemory.ToArray();

            using var bitmap = Conversion.ToImage(pdfBytes, page: 0);
            using var imageData = bitmap.Encode(SKEncodedImageFormat.Jpeg, quality: 80);

            var imageStream = new MemoryStream();
            imageData.SaveTo(imageStream);
            imageStream.Position = 0;

            return Task.FromResult<Stream>(imageStream);
        }
    }
}