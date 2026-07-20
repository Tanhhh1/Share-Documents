using Application.Common;
using Application.CQRS.Majors.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Majors.Commands.CreateMajor
{
    public class CreateMajorHandler : IRequestHandler<CreateMajorCommand, ApiResult<MajorDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public CreateMajorHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<MajorDto>> Handle(CreateMajorCommand request, CancellationToken cancellationToken)
        {
            var facultyId = await _unitOfWork.FacultyRepository.GetByIdAsync(request.FacultyId);
            if (facultyId is null)
                return ApiResult<MajorDto>.Failure("Khoa không tồn tại");

            var existingMajor = await _unitOfWork.MajorRepository
                .GetByCondition(m => m.Name == request.Name)
                .AnyAsync(cancellationToken);
            if (existingMajor)
                return ApiResult<MajorDto>.Failure($"Ngành '{request.Name}' đã tồn tại");

            var major = request.Adapt<Major>();
            await _unitOfWork.MajorRepository.AddAsync(major);
            await _unitOfWork.SaveChangesAsync();
            var majorDto = major.Adapt<MajorDto>();
            return ApiResult<MajorDto>.Success(majorDto);
        }
    }
}
