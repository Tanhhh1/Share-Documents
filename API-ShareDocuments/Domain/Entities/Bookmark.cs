using Domain.Common;
using Domain.Identity;

namespace Domain.Entities
{
    public class Bookmark : BaseEntity
    {
        public int UserId { get; set; }
        public int DocumentId { get; set; }
        public Document Document { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
