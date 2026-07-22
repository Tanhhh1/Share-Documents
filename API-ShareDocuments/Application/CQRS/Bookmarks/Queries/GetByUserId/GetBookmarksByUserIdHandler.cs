using Application.Common;
using Application.CQRS.Bookmarks.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Bookmarks.Queries.GetBookmarkByUserId
{
    public class GetBookmarksByUserIdHandler : IRequestHandler<GetBookmarksByUserIdQuery, ApiResult<PageList<BookmarkDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public GetBookmarksByUserIdHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<PageList<BookmarkDto>>> Handle(GetBookmarksByUserIdQuery request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<PageList<BookmarkDto>>.Failure("Người dùng chưa đăng nhập");

            var userId = _currentUser.Id.Value;

            var listBookmark = _unitOfWork.BookmarkRepository
                .GetByCondition(b => b.UserId == userId, q => q.OrderByDescending(b => b.CreatedAt))
                .ProjectToType<BookmarkDto>();

            var pageList = await PageList<BookmarkDto>.ToPagedListAsync(
                listBookmark,
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<BookmarkDto>>.Success(pageList);
        }
    }
}
