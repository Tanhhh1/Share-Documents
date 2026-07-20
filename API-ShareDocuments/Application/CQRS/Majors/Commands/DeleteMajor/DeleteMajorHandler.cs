using Application.Common;
using Application.CQRS.Majors.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Majors.Commands.DeleteMajor
{
    public class DeleteMajorHandler : IRequestHandler<DeleteMajorCommand, ApiResult<MajorDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public DeleteMajorHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<MajorDto>> Handle(DeleteMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await _unitOfWork.MajorRepository.GetByIdAsync(request.Id);
            if (major is null)
                return ApiResult<MajorDto>.Failure("Không tìm thấy ngành học");
            major.IsActive = false;
            _unitOfWork.MajorRepository.Update(major);
            var majorDto = major.Adapt<MajorDto>();
            return ApiResult<MajorDto>.Success(majorDto);
        }
    }
}
