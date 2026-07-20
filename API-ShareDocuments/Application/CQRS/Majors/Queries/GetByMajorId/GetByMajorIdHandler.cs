using Application.Common;
using Application.CQRS.Majors.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Majors.Queries.GetByMajorId
{
    public class GetByMajorIdHandler : IRequestHandler<GetByMajorIdQuery, ApiResult<MajorDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetByMajorIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<MajorDto>> Handle(GetByMajorIdQuery request, CancellationToken cancellationToken)
        {
            var major = await _unitOfWork.MajorRepository
                .GetByCondition(m => m.Id == request.Id)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken);
            if (major is null)
                return ApiResult<MajorDto>.Failure("Ngành học không tồn tại");

            var majorDto = major.Adapt<MajorDto>();
            return ApiResult<MajorDto>.Success(majorDto);
        }
    }
}
