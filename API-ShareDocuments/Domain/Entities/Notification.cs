using Domain.Common;
using Domain.Enums;
using Domain.Identity;

namespace Domain.Entities
{
    public class Notification : BaseEntity
    {
        public int UserId { get; set; }
        public NotificationType Type { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public EntityType RelatedEntityType { get; set; }
        public int RelatedEntityId { get; set; }
        public bool IsRead { get; set; }
        public User User { get; set; } = null!;
    }
}
