using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Bookmarks.Commands.DeleteBookmark
{
    public class DeleteBookmarkHandler : IRequestHandler<DeleteBookmarkCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public DeleteBookmarkHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(DeleteBookmarkCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<bool>.Failure("Người dùng chưa đăng nhập");

            var userId = _currentUser.Id.Value;

            var bookmark = await _unitOfWork.BookmarkRepository
                .GetByCondition(b => b.UserId == userId && b.DocumentId == request.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (bookmark is null)
                return ApiResult<bool>.Failure("Không tìm thấy bookmark cần xóa");

            _unitOfWork.BookmarkRepository.Delete(bookmark);
            return ApiResult<bool>.Success(true);
        }
    }
}
