using Domain.Common;
using Domain.Enums;

namespace Domain.Events
{
    public class DocumentModeratedEvent : BaseDomainEvent
    {
        public int DocumentId { get; }
        public int DocumentOwnerId { get; }
        public int ModeratorId { get; }
        public ModerationAction Action { get; }
        public string? Reason { get; }

        public DocumentModeratedEvent(int documentId, int documentOwnerId, int moderatorId, ModerationAction action, string? reason)
        {
            DocumentId = documentId;
            DocumentOwnerId = documentOwnerId;
            ModeratorId = moderatorId;
            Action = action;
            Reason = reason;
        }
    }
}
