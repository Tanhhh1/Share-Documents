using Application.Common;
using Application.CQRS.Comments.DTOs;
using MediatR;

namespace Application.CQRS.Comments.Commands.CreateComment
{
    public class CreateCommentCommand : IRequest<ApiResult<CommentDto>>
    {
        public int DocumentId { get; set; }
        public int? ParentCommentId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
