using Application.Common;
using Application.CQRS.Majors.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Majors.Commands.UpdateMajor
{
    public class UpdateMajorHandler : IRequestHandler<UpdateMajorCommand, ApiResult<MajorDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public UpdateMajorHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<MajorDto>> Handle(UpdateMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await _unitOfWork.MajorRepository.GetByIdAsync(request.Id);
            if (major is null)
                return ApiResult<MajorDto>.Failure("Ngành học không tồn tại");

            var faculty = await _unitOfWork.FacultyRepository.GetByIdAsync(request.FacultyId);
            if (faculty is null)
                return ApiResult<MajorDto>.Failure("Khoa không tồn tại");

            var existingMajor = await _unitOfWork.MajorRepository
                .GetByCondition(m => m.Name == request.Name)
                .AnyAsync(cancellationToken);
            if (existingMajor)
                return ApiResult<MajorDto>.Failure($"Ngành '{request.Name}' đã tồn tại");

            request.Adapt(major);
            _unitOfWork.MajorRepository.Update(major);
            var majorDto = major.Adapt<MajorDto>();
            return ApiResult<MajorDto>.Success(majorDto);
        }
    }
}
