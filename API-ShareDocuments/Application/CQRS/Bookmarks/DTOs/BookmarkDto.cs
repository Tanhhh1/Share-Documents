namespace Application.CQRS.Bookmarks.DTOs
{
    public class BookmarkDto
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public string DocumentTitle { get; set; } = string.Empty;
        public string? DocumentDescription { get; set; }
        public string? ThumbnailUrl { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}