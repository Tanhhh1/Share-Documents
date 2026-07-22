using Application.Common;
using Application.CQRS.Bookmarks.DTOs;
using MediatR;

namespace Application.CQRS.Bookmarks.Queries.GetBookmarkByUserId
{
    public class GetBookmarksByUserIdQuery : IRequest<ApiResult<PageList<BookmarkDto>>>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
