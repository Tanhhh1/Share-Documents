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
        public List<DocumentTagDto> Tags { get; set; } = new();
        public List<DocumentFileDto> Files { get; set; } = new();
    }

    public class DocumentTagDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
