using Application.CQRS.Notifications.DTOs;
using Application.Hubs;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task NotifyUserAsync(int userId, NotificationDto notificationDto, CancellationToken cancellationToken)
        {
            await _hubContext.Clients.Group($"user-{userId}").SendAsync("ReceiveNotification", notificationDto, cancellationToken);
        }
    }
}
