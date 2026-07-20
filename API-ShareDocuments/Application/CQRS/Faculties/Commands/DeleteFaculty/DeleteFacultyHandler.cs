using Application.Common;
using Application.CQRS.Faculties.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Faculties.Commands.DeleteFaculty
{
    public class DeleteFacultyHandler : IRequestHandler<DeleteFacultyCommand, ApiResult<FacultyDto>>
    {
        private readonly IUnitOfWork unitOfWork;
        public DeleteFacultyHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<FacultyDto>> Handle(DeleteFacultyCommand request, CancellationToken cancellationToken)
        {
            var faculty = await unitOfWork.FacultyRepository.GetByIdAsync(request.Id);
            if (faculty is null)
                return ApiResult<FacultyDto>.Failure("Không tìm thấy khoa");
            faculty.IsActive = false;
            unitOfWork.FacultyRepository.Update(faculty);
            var facultyDto = faculty.Adapt<FacultyDto>();
            return ApiResult<FacultyDto>.Success(facultyDto);
        }
    }
}
