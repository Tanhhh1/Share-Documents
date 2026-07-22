using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.CQRS.DocumentGroups.Queries.GetAllGroup
{
    public class GetAllGroupQuery : IRequest<ApiResult<PageList<DocumentGroupDto>>>
    {
        public string? Search { get; set; }
        public DocumentStatus? Status { get; set; }
        public bool? IsDeleted { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }

}
