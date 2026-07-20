using Application.Common;
using MediatR;

namespace Application.CQRS.Bookmarks.Commands.SaveBookmark
{
    public class SaveBookmarkCommand : IRequest<ApiResult<bool>>
    {
        public int DocumentId { get; set; }
    }
}
