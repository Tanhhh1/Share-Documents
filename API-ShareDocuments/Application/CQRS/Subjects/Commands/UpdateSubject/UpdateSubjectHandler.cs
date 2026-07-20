using Application.Common;
using Application.CQRS.Subjects.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Subjects.Commands.UpdateSubject
{
    public class UpdateSubjectHandler : IRequestHandler<UpdateSubjectCommand, ApiResult<SubjectDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public UpdateSubjectHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<SubjectDto>> Handle(UpdateSubjectCommand request, CancellationToken cancellationToken)
        {
            var subject = await _unitOfWork.SubjectRepository.GetByIdAsync(request.Id);
            if (subject is null)
                return ApiResult<SubjectDto>.Failure("Môn học không tồn tại");

            var existingSubject = await _unitOfWork.SubjectRepository
                .GetByCondition(s => s.Name == request.Name)
                .AnyAsync(cancellationToken);
            if(existingSubject)
                return ApiResult<SubjectDto>.Failure($"Môn học '{request.Name}' đã tồn tại");

            var education = await _unitOfWork.EducationRepository.GetByIdAsync(request.EducationLevelId);
            if (education is null)
                return ApiResult<SubjectDto>.Failure("Cấp bậc giáo dục không tồn tại");

            request.Adapt(subject);
            _unitOfWork.SubjectRepository.Update(subject);
            var subjectDto = subject.Adapt<SubjectDto>();
            return ApiResult<SubjectDto>.Success(subjectDto);
        }
    }
}
