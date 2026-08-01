using Domain.Common;
using Domain.Enums;

namespace Domain.Events
{
    public class DocumentGroupModeratedEvent : BaseDomainEvent
    {
        public int DocumentGroupId { get; }
        public int GroupOwnerId { get; }
        public int ModeratorId { get; }
        public ModerationAction Action { get; }
        public string? Reason { get; }

        public DocumentGroupModeratedEvent(int documentGroupId, int groupOwnerId, int moderatorId, ModerationAction action, string? reason)
        {
            DocumentGroupId = documentGroupId;
            GroupOwnerId = groupOwnerId;
            ModeratorId = moderatorId;
            Action = action;
            Reason = reason;
        }
    }
}
