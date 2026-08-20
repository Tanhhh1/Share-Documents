using Application.Common;
using MediatR;

namespace Application.CQRS.Notifications.Commands.MarkAsRead
{
    public class MarkNotificationAsReadCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}