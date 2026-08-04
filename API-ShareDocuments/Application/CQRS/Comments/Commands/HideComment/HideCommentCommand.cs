using Application.Common;
using MediatR;

namespace Application.CQRS.Comments.Commands.HideComment
{
    public class HideCommentCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}
