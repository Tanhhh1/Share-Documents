using Application.Common;
using Application.CQRS.Subjects.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Subjects.Commands.CreateSubject
{
    public class CreateSubjectHandler : IRequestHandler<CreateSubjectCommand, ApiResult<SubjectDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public CreateSubjectHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<SubjectDto>> Handle(CreateSubjectCommand request, CancellationToken cancellationToken)
        {
            var existingSubject = await _unitOfWork.SubjectRepository
                .GetByCondition(s => s.Name == request.Name)
                .AnyAsync(cancellationToken);
            if (existingSubject)
                return ApiResult<SubjectDto>.Failure($"Môn học '{request.Name}' đã tồn tại");

            var education = await _unitOfWork.EducationRepository.GetByIdAsync(request.EducationLevelId);
            if (education is null)
                return ApiResult<SubjectDto>.Failure("Cấp bậc giáo dục không tồn tại");

            var subject = request.Adapt<Subject>();
            await _unitOfWork.SubjectRepository.AddAsync(subject);
            await _unitOfWork.SaveChangesAsync();
            var subjectDto = subject.Adapt<SubjectDto>();
            return ApiResult<SubjectDto>.Success(subjectDto);
        }
    }
}
