using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using MediatR;

namespace Application.Events
{
    public class CommentChangedEventHandler : INotificationHandler<CommentChangedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CommentChangedEventHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(CommentChangedEvent notification, CancellationToken cancellationToken)
        {
            if (notification.ParentCommentId is null)
            {
                var document = await _unitOfWork.DocumentRepository.GetByIdAsync(notification.DocumentId);
                if (document is null || document.UserId == notification.CommenterId)
                    return;

                await _unitOfWork.NotificationRepository.AddAsync(new Notification
                {
                    UserId = document.UserId,
                    Type = NotificationType.CommentNew,
                    Title = "Có bình luận mới",
                    Content = "Tài liệu của bạn vừa nhận được một bình luận mới",
                    RelatedEntityType = EntityType.Comment,
                    RelatedEntityId = notification.CommentId,
                    IsRead = false
                });
            }
            else
            {
                var parentComment = await _unitOfWork.CommentRepository.GetByIdAsync(notification.ParentCommentId.Value);
                if (parentComment is null || parentComment.UserId == notification.CommenterId)
                    return;

                await _unitOfWork.NotificationRepository.AddAsync(new Notification
                {
                    UserId = parentComment.UserId,
                    Type = NotificationType.CommentReply,
                    Title = "Có phản hồi bình luận",
                    Content = "Bình luận của bạn vừa nhận được một phản hồi mới",
                    RelatedEntityType = EntityType.Comment,
                    RelatedEntityId = notification.CommentId,
                    IsRead = false
                });
            }
        }
    }
}
