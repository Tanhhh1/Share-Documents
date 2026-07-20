using Application.Common;
using Application.CQRS.Majors.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Majors.Commands.RestoreMajor
{
    public class RestoreMajorHandler : IRequestHandler<RestoreMajorCommand, ApiResult<MajorDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public RestoreMajorHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<MajorDto>> Handle(RestoreMajorCommand request, CancellationToken cancellationToken)
        {
            var major = await _unitOfWork.MajorRepository.GetByIdAsync(request.Id);
            if (major is null)
                return ApiResult<MajorDto>.Failure("Không tìm thấy ngành học");
            major.IsActive = true;
            _unitOfWork.MajorRepository.Update(major);
            var majorDto = major.Adapt<MajorDto>();
            return ApiResult<MajorDto>.Success(majorDto);
        }
    }
}
