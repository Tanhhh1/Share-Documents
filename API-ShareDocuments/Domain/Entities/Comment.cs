using Domain.Common;
using Domain.Identity;

namespace Domain.Entities
{
    public class Comment : BaseEntity
    {
        public int DocumentId { get; set; }
        public int UserId { get; set; }
        public int? ParentCommentId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public Document Document { get; set; } = null!;
        public User User { get; set; } = null!;
        public Comment? ParentComment { get; set; }
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();
    }
}
