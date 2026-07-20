using Application.Common;
using Application.CQRS.Reports.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Reports.Queries.GetAllReport
{
    public class GetAllReportsHandler : IRequestHandler<GetAllReportQuery, ApiResult<PageList<ReportDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllReportsHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<PageList<ReportDto>>> Handle(GetAllReportQuery request, CancellationToken cancellationToken)
        {
            var reports = _unitOfWork.ReportRepository.GetByCondition().AsNoTracking();

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                var keyword = request.Keyword.Trim();
                reports = reports.Where(r => r.Reason.Contains(keyword) || r.Content.Contains(keyword));
            }
            if (request.DocumentId.HasValue)
                reports = reports.Where(r => r.DocumentId == request.DocumentId.Value);
            if (request.UserId.HasValue)
                reports = reports.Where(r => r.UserId == request.UserId.Value);

            reports = reports.Include(r => r.Document).Include(r => r.User).OrderByDescending(r => r.CreatedAt);

            var pageList = await PageList<ReportDto>.ToPagedListAsync(
                reports.ProjectToType<ReportDto>(),
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            return ApiResult<PageList<ReportDto>>.Success(pageList);
        }
    }
}
