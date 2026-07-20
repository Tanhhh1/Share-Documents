using Application.Common;
using Application.CQRS.Subjects.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Subjects.Queries.GetAllSubject
{
    public class GetAllSubjectHandler : IRequestHandler<GetAllSubjectQuery, ApiResult<PageList<SubjectDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetAllSubjectHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<PageList<SubjectDto>>> Handle(GetAllSubjectQuery request, CancellationToken cancellationToken)
        {
            var subject = _unitOfWork.SubjectRepository.GetByCondition().AsNoTracking();
            if (!string.IsNullOrEmpty(request.Search))
            {
                var keywords = request.Search.Trim();
                subject = subject.Where(s => s.Name.Contains(keywords));
            }

            if(request.EducationLevelId.HasValue)
                subject = subject.Where(s => s.EducationLevelId == request.EducationLevelId.Value);

            if(request.MajorId.HasValue)
                subject = subject.Where(s => s.MajorId == request.MajorId.Value);

            if(request.IsActive.HasValue)
                subject = subject.Where(s => s.IsActive == request.IsActive.Value);

            var pageList = await PageList<SubjectDto>.ToPagedListAsync(
                subject.ProjectToType<SubjectDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<SubjectDto>>.Success(pageList);
        }
    }
}
