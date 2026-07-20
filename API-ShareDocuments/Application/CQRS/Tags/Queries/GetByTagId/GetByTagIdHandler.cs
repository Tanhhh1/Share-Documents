using Application.Common;
using Application.CQRS.Tags.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Tags.Queries.GetByTagId
{
    public class GetByTagIdHandler : IRequestHandler<GetByTagIdQuery, ApiResult<TagDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetByTagIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<TagDto>> Handle(GetByTagIdQuery request, CancellationToken cancellationToken)
        {
            var tag = await _unitOfWork.TagRepository
                .GetByCondition(t => t.Id == request.Id)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken);
            if (tag is null)
                return ApiResult<TagDto>.Failure("Thẻ phân loại không tồn tại");

            var tagDto = tag.Adapt<TagDto>();
            return ApiResult<TagDto>.Success(tagDto);
        }
    }
}
