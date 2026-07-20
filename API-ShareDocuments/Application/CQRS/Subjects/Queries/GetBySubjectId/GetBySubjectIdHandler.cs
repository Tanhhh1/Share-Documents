using Application.Common;
using Application.CQRS.Subjects.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Subjects.Queries.GetBySubjectId
{
    public class GetBySubjectIdHandler : IRequestHandler<GetBySubjectIdQuery, ApiResult<SubjectDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetBySubjectIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<SubjectDto>> Handle(GetBySubjectIdQuery request, CancellationToken cancellationToken)
        {
            var subject = await _unitOfWork.SubjectRepository
                .GetByCondition(s => s.Id == request.Id)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken);
            if (subject is null)
                return ApiResult<SubjectDto>.Failure("Môn học không tồn tại");
            var subjectDto = subject.Adapt<SubjectDto>();
            return ApiResult<SubjectDto>.Success(subjectDto);
        }
    }
}
