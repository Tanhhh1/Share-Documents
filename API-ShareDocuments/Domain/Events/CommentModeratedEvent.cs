using Domain.Common;
using Domain.Enums;

namespace Domain.Events
{
    public class CommentModeratedEvent : BaseDomainEvent
    {
        public int CommentId { get; }
        public int CommentOwnerId { get; }
        public int ModeratorId { get; }
        public ModerationAction Action { get; }

        public CommentModeratedEvent(int commentId, int commentOwnerId, int moderatorId, ModerationAction action)
        {
            CommentId = commentId;
            CommentOwnerId = commentOwnerId;
            ModeratorId = moderatorId;
            Action = action;
        }
    }
}
