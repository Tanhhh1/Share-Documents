using Application.Common;
using MediatR;

namespace Application.CQRS.Bookmarks.Commands.DeleteBookmark
{
    public class DeleteBookmarkCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}
