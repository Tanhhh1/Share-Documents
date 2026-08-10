using Domain.Enums;

namespace Application.CQRS.DocumentGroups.DTOs
{
    public class DocumentGroupDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DocumentStatus Status { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
