using Application.Common;
using Application.CQRS.Bookmarks.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Bookmarks.Queries.GetBookmarkByUserId
{
    public class GetBookmarkByUserIdHandler : IRequestHandler<GetBookmarkByUserIdQuery, ApiResult<PageList<BookmarkDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        private readonly ISupabaseStorageService _storageService;

        public GetBookmarkByUserIdHandler(
            IUnitOfWork unitOfWork,
            ICurrentUser currentUser,
            ISupabaseStorageService storageService)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _storageService = storageService;
        }

        public async Task<ApiResult<PageList<BookmarkDto>>> Handle(GetBookmarkByUserIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.Id!.Value;
            var listBookmark = _unitOfWork.BookmarkRepository
                .GetByCondition(b => b.UserId == userId, q => q.OrderByDescending(b => b.CreatedAt))
                .ProjectToType<BookmarkDto>();

            var pageList = await PageList<BookmarkDto>.ToPagedListAsync(
                listBookmark,
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            foreach (var item in pageList.Items)
            {
                if (!string.IsNullOrEmpty(item.ThumbnailUrl))
                {
                    item.ThumbnailUrl = _storageService.GetPublicUrl(item.ThumbnailUrl);
                }
            }

            return ApiResult<PageList<BookmarkDto>>.Success(pageList);
        }
    }
}