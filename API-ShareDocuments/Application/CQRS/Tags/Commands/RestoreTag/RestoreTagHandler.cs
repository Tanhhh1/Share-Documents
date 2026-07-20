using Application.Common;
using Application.CQRS.Tags.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Tags.Commands.RestoreTag
{
    public class RestoreTagHandler : IRequestHandler<RestoreTagCommand, ApiResult<TagDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public RestoreTagHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<TagDto>> Handle(RestoreTagCommand request, CancellationToken cancellationToken)
        {
            var tag = await _unitOfWork.TagRepository.GetByIdAsync(request.Id);
            if (tag is null)
                return ApiResult<TagDto>.Failure("Không tìm thấy thẻ phân loại");
            tag.IsDeleted = false;
            _unitOfWork.TagRepository.Update(tag);
            var tagDto = tag.Adapt<TagDto>();
            return ApiResult<TagDto>.Success(tagDto);
        }
    }
}
