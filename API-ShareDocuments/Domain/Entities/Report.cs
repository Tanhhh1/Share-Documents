using Domain.Common;
using Domain.Identity;

namespace Domain.Entities
{
    public class Report : BaseEntity
    {
        public int DocumentId { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Document Document { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
