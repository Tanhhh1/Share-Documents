using Domain.Enums;

namespace Application.CQRS.Notifications.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public NotificationType Type { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public EntityType RelatedEntityType { get; set; }
        public int RelatedEntityId { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
