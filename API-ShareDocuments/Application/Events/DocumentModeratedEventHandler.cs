using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using MediatR;

namespace Application.Events
{
    public class DocumentModeratedEventHandler : INotificationHandler<DocumentModeratedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DocumentModeratedEventHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(DocumentModeratedEvent notification, CancellationToken cancellationToken)
        {
            await _unitOfWork.ModerationLogRepository.AddAsync(new ModerationLog
            {
                UserId = notification.ModeratorId,
                Type = EntityType.Document,
                TargetId = notification.DocumentId,
                Action = notification.Action,
                Reason = notification.Reason
            });

            var (type, title, content) = notification.Action switch
            {
                ModerationAction.Approve => (
                    NotificationType.DocumentApproved,
                    "Tài liệu đã được duyệt",
                    "Tài liệu của bạn đã được duyệt và hiển thị công khai"),
                ModerationAction.Reject => (
                    NotificationType.DocumentRejected,
                    "Tài liệu bị từ chối",
                    $"Tài liệu của bạn đã bị từ chối. Lý do: {notification.Reason}"),
                _ => throw new InvalidOperationException($"Hành động '{notification.Action}' không hợp lệ cho Document")
            };

            await _unitOfWork.NotificationRepository.AddAsync(new Notification
            {
                UserId = notification.DocumentOwnerId,
                Type = type,
                Title = title,
                Content = content,
                RelatedEntityType = EntityType.Document,
                RelatedEntityId = notification.DocumentId,
                IsRead = false
            });

        }
    }
}
