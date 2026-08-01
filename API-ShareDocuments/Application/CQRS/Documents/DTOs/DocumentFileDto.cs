namespace Application.CQRS.Documents.DTOs
{
    public class DocumentFileDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public bool HasPreview { get; set; }
    }
}
