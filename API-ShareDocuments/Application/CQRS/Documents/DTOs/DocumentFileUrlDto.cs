using Domain.Enums;

namespace Application.CQRS.Documents.DTOs
{
    public class DocumentFileUrlDto
    {
        public string FileName { get; set; } = string.Empty;
        public string SignedUrl { get; set; } = string.Empty;
        public int ExpiresInSeconds { get; set; }
        public FileConversionStatus ConversionStatus { get; set; }
    }
}
