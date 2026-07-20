using Application.Common;
using Application.CQRS.Faculties.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Faculties.Commands.RestoreFaculty
{
    public class RestoreFacultyHandler : IRequestHandler<RestoreFacultyCommand, ApiResult<FacultyDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public RestoreFacultyHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<FacultyDto>> Handle(RestoreFacultyCommand request, CancellationToken cancellationToken)
        {
            var faculty= await _unitOfWork.FacultyRepository.GetByIdAsync(request.Id);
            if (faculty is null)
                return ApiResult<FacultyDto>.Failure("Không tìm thấy khoa");
            faculty.IsActive = true;
            _unitOfWork.FacultyRepository.Update(faculty);
            var facultyDto = faculty.Adapt<FacultyDto>();
            return ApiResult<FacultyDto>.Success(facultyDto);
        }
    }
}
