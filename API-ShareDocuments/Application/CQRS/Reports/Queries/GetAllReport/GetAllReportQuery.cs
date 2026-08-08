using Application.Common;
using Application.CQRS.Reports.DTOs;
using MediatR;

namespace Application.CQRS.Reports.Queries.GetAllReport
{
    public class GetAllReportQuery : IRequest<ApiResult<PageList<ReportDto>>>
    {
        public string? Keyword { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
