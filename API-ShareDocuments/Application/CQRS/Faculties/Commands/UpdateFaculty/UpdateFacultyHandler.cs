using Application.Common;
using Application.CQRS.Faculties.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Faculties.Commands.UpdateFaculty
{
    public class UpdateFacultyHandler : IRequestHandler<UpdateFacultyCommand, ApiResult<FacultyDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public UpdateFacultyHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<FacultyDto>> Handle(UpdateFacultyCommand request, CancellationToken cancellationToken)
        {
            var faculty = await _unitOfWork.FacultyRepository.GetByIdAsync(request.Id);
            if(faculty is null)
                return ApiResult<FacultyDto>.Failure("Khoa không tồn tại");

            var existingFaculty = await _unitOfWork.FacultyRepository
                .GetByCondition(f => f.Name == request.Name)
                .AnyAsync(cancellationToken);
            if(existingFaculty)
                return ApiResult<FacultyDto>.Failure($"Khoa '{request.Name}' đã tồn tại");

            request.Adapt(faculty);
            _unitOfWork.FacultyRepository.Update(faculty);
            var facultyDto = faculty.Adapt<FacultyDto>();
            return ApiResult<FacultyDto>.Success(facultyDto);
        }
    }
}
