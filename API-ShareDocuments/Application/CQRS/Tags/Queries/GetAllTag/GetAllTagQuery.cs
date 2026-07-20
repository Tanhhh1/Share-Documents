using Application.Common;
using Application.CQRS.Tags.DTOs;
using MediatR;

namespace Application.CQRS.Tags.Queries.GetAllTag
{
    public class GetAllTagQuery : IRequest<ApiResult<PageList<TagDto>>>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string? Search { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
