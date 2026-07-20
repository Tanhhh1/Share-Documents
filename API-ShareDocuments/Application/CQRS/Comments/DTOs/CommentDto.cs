namespace Application.CQRS.Comments.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public int? ParentCommentId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<CommentDto> Replies { get; set; } = new();
    }
}
