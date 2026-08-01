using Domain.Common;

namespace Domain.Events
{
    public class CommentChangedEvent : BaseDomainEvent
    {
        public int CommentId { get; }
        public int DocumentId { get; }
        public int CommenterId { get; }
        public int? ParentCommentId { get; }

        public CommentChangedEvent(int commentId, int documentId, int commenterId, int? parentCommentId)
        {
            CommentId = commentId;
            DocumentId = documentId;
            CommenterId = commenterId;
            ParentCommentId = parentCommentId;
        }
    }
}
