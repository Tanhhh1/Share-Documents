using Domain.Enums;

namespace Application.CQRS.Documents.DTOs
{
    public class DocumentDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DocumentStatus Status { get; set; }
        public AccessLevel AccessLevel { get; set; }
        public int ViewCount { get; set; }
        public int DownloadCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public int? GroupId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }

        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string S3Key { get; set; } = string.Empty;
        public string? PreviewPdfKey { get; set; }
        public string? ThumbnailKey { get; set; }
        public FileConversionStatus ConversionStatus { get; set; }

        public List<DocumentTagDto> Tags { get; set; } = new();
    }

    public class DocumentTagDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}