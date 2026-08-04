using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using MediatR;

namespace Application.Events
{
    public class CommentModeratedEventHandler : INotificationHandler<CommentModeratedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CommentModeratedEventHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(CommentModeratedEvent notification, CancellationToken cancellationToken)
        {
            await _unitOfWork.ModerationLogRepository.AddAsync(new ModerationLog
            {
                UserId = notification.ModeratorId,
                Type = EntityType.Comment,
                TargetId = notification.CommentId,
                Action = notification.Action,
            });

            await _unitOfWork.NotificationRepository.AddAsync(new Notification
            {
                UserId = notification.CommentOwnerId,
                Type = NotificationType.CommentHidden,
                Title = "Bình luận đã bị ẩn",
                Content = $"Bình luận của bạn đã bị ẩn vì không phù hợp",
                RelatedEntityType = EntityType.Comment,
                RelatedEntityId = notification.CommentId,
                IsRead = false
            });
        }
    }
}
