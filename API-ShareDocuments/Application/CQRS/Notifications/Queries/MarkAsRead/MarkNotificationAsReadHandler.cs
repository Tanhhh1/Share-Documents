using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Notifications.Commands.MarkAsRead
{
    public class MarkNotificationAsReadHandler : IRequestHandler<MarkNotificationAsReadCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public MarkNotificationAsReadHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
        {
            var notification = await _unitOfWork.NotificationRepository
                .GetByCondition(n => n.Id == request.Id && n.UserId == _currentUser.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (notification is null)
                return ApiResult<bool>.Failure("Không tìm thấy thông báo");

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                await _unitOfWork.SaveChangesAsync();
            }

            return ApiResult<bool>.Success(true);
        }
    }
}