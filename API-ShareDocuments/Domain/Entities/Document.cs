using Domain.Common;
using Domain.Enums;
using Domain.Identity;

namespace Domain.Entities
{
    public class Document : BaseEntity
    {
        public int? GroupId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SubjectId { get; set; }
        public int UserId { get; set; }
        public DocumentStatus Status { get; set; }
        public AccessLevel AccessLevel { get; set; }
        public int ViewCount { get; set; }
        public int DownloadCount { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
        public DocumentGroup? Group { get; set; }
        public User User { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
        public ICollection<DocumentFile> Files { get; set; } = new List<DocumentFile>();
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}
