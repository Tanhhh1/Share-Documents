using Application.Common;
using MediatR;

namespace Application.CQRS.Comments.Commands.DeleteComment
{
    public class DeleteCommentCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}
