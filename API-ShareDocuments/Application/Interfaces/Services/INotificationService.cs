using Application.CQRS.Notifications.DTOs;

namespace Application.Interfaces.Services
{
    public interface INotificationService
    {
        Task NotifyUserAsync(int userId, NotificationDto notification, CancellationToken cancellationToken = default);
    }
}
