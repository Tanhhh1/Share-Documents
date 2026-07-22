using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using MediatR;

namespace Application.CQRS.DocumentGroups.Queries.GetPublishedGroup
{
    public class GetPublishedGroupQuery : IRequest<ApiResult<PageList<DocumentGroupDto>>>
    {
        public string? Search { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
