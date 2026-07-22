using Application.Common;
using Application.CQRS.Comments.DTOs;
using MediatR;

namespace Application.CQRS.Comments.Queries.GetAllCmt
{
    public class GetAllcommentQuery : IRequest<ApiResult<PageList<ListCommentDto>>>
    {
        public string? Keyword { get; set; }
        public int? DocumentId { get; set; }
        public int? UserId { get; set; }
        public bool? IsDeleted { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
