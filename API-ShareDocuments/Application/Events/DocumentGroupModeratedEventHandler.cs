using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Events
{
    public class DocumentGroupModeratedEventHandler : INotificationHandler<DocumentGroupModeratedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DocumentGroupModeratedEventHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(DocumentGroupModeratedEvent notification, CancellationToken cancellationToken)
        {
            await _unitOfWork.ModerationLogRepository.AddAsync(new ModerationLog
            {
                UserId = notification.ModeratorId,
                Type = EntityType.DocumentGroup,
                TargetId = notification.DocumentGroupId,
                Action = notification.Action,
                Reason = notification.Reason
            });

            var (type, title, content) = notification.Action switch
            {
                ModerationAction.Approve => (
                    NotificationType.DocumentGroupApproved,
                    "Nhóm chủ đề đã được duyệt",
                    "Nhóm chủ đề của bạn đã được duyệt và hiển thị công khai."),
                ModerationAction.Reject => (
                    NotificationType.DocumentGroupRejected,
                    "Nhóm chủ đề bị từ chối",
                    $"Nhóm chủ đề của bạn đã bị từ chối. Lý do: {notification.Reason}"),
                _ => throw new InvalidOperationException($"Hành động '{notification.Action}' không hợp lệ cho DocumentGroup")
            };

            await _unitOfWork.NotificationRepository.AddAsync(new Notification
            {
                UserId = notification.GroupOwnerId,
                Type = type,
                Title = title,
                Content = content,
                RelatedEntityType = EntityType.DocumentGroup,
                RelatedEntityId = notification.DocumentGroupId,
                IsRead = false
            });
        }
    }
}
