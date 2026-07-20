using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Bookmarks.Commands.SaveBookmark
{
    public class SaveBookmarkCommandHandler : IRequestHandler<SaveBookmarkCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public SaveBookmarkCommandHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }
        public async Task<ApiResult<bool>> Handle(SaveBookmarkCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<bool>.Failure("Người dùng chưa đăng nhập"); 
            
            var userId = _currentUser.Id.Value;
            var isExisted = await _unitOfWork.BookmarkRepository
                .GetByCondition(b => b.UserId == userId && b.DocumentId == request.DocumentId)
                .AnyAsync(cancellationToken);

            if (isExisted)
                return ApiResult<bool>.Failure("Tài liệu đã được lưu trước đó");

            var bookmark = new Bookmark
            {
                UserId = userId,
                DocumentId = request.DocumentId
            };

            await _unitOfWork.BookmarkRepository.AddAsync(bookmark);
            await _unitOfWork.SaveChangesAsync();
            return ApiResult<bool>.Success(true);
        }
    }
}
