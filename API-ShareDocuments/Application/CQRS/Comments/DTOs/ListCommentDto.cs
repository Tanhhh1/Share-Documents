namespace Application.CQRS.Comments.DTOs
{
    public class ListCommentDto
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public string DocumentTitle { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int? ParentCommentId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }
}
