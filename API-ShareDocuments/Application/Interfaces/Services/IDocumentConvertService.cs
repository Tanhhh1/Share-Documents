namespace Application.Interfaces.Services
{
    public interface IDocumentConvertService
    {
        Task<Stream> ConvertPdfAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default);
        Task<Stream> GenerateThumbnailAsync(Stream pdfStream, CancellationToken cancellationToken = default);
    }
}