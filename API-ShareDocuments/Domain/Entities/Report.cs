using Domain.Common;
using Domain.Identity;

namespace Domain.Entities
{
    public class Report : BaseEntity
    {
        public int DocumentId { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; } = null!;
        public string Content { get; set; } = null!;
        public Document Document { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
