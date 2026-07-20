using Application.Common;
using Application.CQRS.Subjects.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Subjects.Commands.DeleteSubject
{
    public class DeleteSubjectHandler : IRequestHandler<DeleteSubjectCommand, ApiResult<SubjectDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public DeleteSubjectHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<SubjectDto>> Handle(DeleteSubjectCommand request, CancellationToken cancellationToken)
        {
            var subject = await _unitOfWork.SubjectRepository.GetByIdAsync(request.Id);
            if (subject is null)
                return ApiResult<SubjectDto>.Failure("Không tìm thấy môn học");
            subject.IsActive = false;
            _unitOfWork.SubjectRepository.Update(subject);
            var subjectDto = subject.Adapt<SubjectDto>();
            return ApiResult<SubjectDto>.Success(subjectDto);
        }
    }
}
