using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.CQRS.DocumentGroups.Queries.GetByUserId
{
    public class GetGroupByUserIdQuery : IRequest<ApiResult<PageList<DocumentGroupDto>>>
    {
        public string? Search { get; set; }
        public DocumentStatus? Status { get; set; }
        public bool? IsDeleted { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
