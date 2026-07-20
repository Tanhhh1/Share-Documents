using Application.Common;
using Application.CQRS.Tags.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Tags.Commands.UpdateTag
{
    public class UpdateTagHandler : IRequestHandler<UpdateTagCommand, ApiResult<TagDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public UpdateTagHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<TagDto>> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
        {
            var tag = await _unitOfWork.TagRepository.GetByIdAsync(request.Id);
            if(tag is null)
                return ApiResult<TagDto>.Failure("Thẻ phân loại không tồn tại");

            var existingTag = await _unitOfWork.TagRepository
                .GetByCondition(t => t.Name == request.Name)
                .AnyAsync(cancellationToken);
            if (existingTag)
                return ApiResult<TagDto>.Failure($"Thẻ phân loại tên '{request.Name}' đã tồn tại");

            request.Adapt(tag);
            _unitOfWork.TagRepository.Update(tag);
            var tagDto = tag.Adapt<TagDto>();
            return ApiResult<TagDto>.Success(tagDto);
        }
    }
}
