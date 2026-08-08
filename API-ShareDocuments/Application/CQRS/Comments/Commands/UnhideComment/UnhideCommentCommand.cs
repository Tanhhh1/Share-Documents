using Application.Common;
using MediatR;

namespace Application.CQRS.Comments.Commands.UnhideComment
{
    public class UnhideCommentCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}
