using Application.Common;
using Application.CQRS.Notifications.DTOs;
using MediatR;

namespace Application.CQRS.Notifications.Queries.GetNotifications
{
    public class GetNotificationsQuery : IRequest<ApiResult<PageList<NotificationDto>>>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool? IsRead { get; set; }
    }
}