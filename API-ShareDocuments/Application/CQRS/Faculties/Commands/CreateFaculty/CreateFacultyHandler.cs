using Application.Common;
using Application.CQRS.Faculties.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Faculties.Commands.CreateFaculty
{
    public class CreateFacultyHandler : IRequestHandler<CreateFacultyCommand, ApiResult<FacultyDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public CreateFacultyHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<FacultyDto>> Handle(CreateFacultyCommand request, CancellationToken cancellationToken)
        {
            var existingFaculty = await _unitOfWork.FacultyRepository
                .GetByCondition(f => f.Name == request.Name)
                .AnyAsync(cancellationToken);
            if(existingFaculty)
                return ApiResult<FacultyDto>.Failure($"Khoa '{request.Name}' đã tồn tại");
            var faculty = request.Adapt<Faculty>();
            await _unitOfWork.FacultyRepository.AddAsync(faculty);
            await _unitOfWork.SaveChangesAsync();
            var facultyDto = faculty.Adapt<FacultyDto>();
            return ApiResult<FacultyDto>.Success(facultyDto);
        }
    }
}
