namespace Application.CQRS.Bookmarks.DTOs
{
    public class BookmarkDto
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public string DocumentTitle { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
