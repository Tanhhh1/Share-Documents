using Application.Common;
using Application.CQRS.Majors.DTOs;
using Application.CQRS.Notifications.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Mapster;
using MediatR;

namespace Application.CQRS.Notifications.Queries.GetNotifications
{
    public class GetNotificationsHandler : IRequestHandler<GetNotificationsQuery, ApiResult<PageList<NotificationDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public GetNotificationsHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<PageList<NotificationDto>>> Handle(GetNotificationsQuery request, CancellationToken cancellationToken)
        {
            var notifications = _unitOfWork.NotificationRepository
                .GetByCondition(n => n.UserId == _currentUser.Id);

            if (request.IsRead.HasValue)
                notifications = notifications.Where(n => n.IsRead == request.IsRead.Value);

            notifications = notifications.OrderByDescending(n => n.CreatedAt);

            var pageList = await PageList<NotificationDto>.ToPagedListAsync(
                notifications.ProjectToType<NotificationDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<NotificationDto>>.Success(pageList);
        }
    }
}