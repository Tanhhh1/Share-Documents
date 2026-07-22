using Domain.Common;

namespace Domain.Entities
{
    public class DocumentFile : BaseEntity
    {
        public int DocumentId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string S3Key { get; set; } = string.Empty;
        public string? PreviewPdfKey { get; set; }
        public Document Document { get; set; } = null!;
    }
}
