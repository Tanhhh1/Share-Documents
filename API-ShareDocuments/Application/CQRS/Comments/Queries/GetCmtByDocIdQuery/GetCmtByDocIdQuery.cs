using Application.Common;
using Application.CQRS.Comments.DTOs;
using MediatR;

namespace Application.CQRS.Comments.Queries.GetCmtByDocIdQuery
{
    public class GetCmtByDocIdQuery : IRequest<ApiResult<PageList<CommentDto>>>
    {
        public int Id { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
