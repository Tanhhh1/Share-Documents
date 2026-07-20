using Application.Common;
using Application.CQRS.Tags.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Tags.Commands.CreateTag
{
    public class CreateTagHandler : IRequestHandler<CreateTagCommand, ApiResult<TagDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public CreateTagHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<TagDto>> Handle(CreateTagCommand request, CancellationToken cancellationToken)
        {
            var existingTag = await _unitOfWork.TagRepository
                .GetByCondition(t => t.Name == request.Name)
                .AnyAsync(cancellationToken);

            if (existingTag)
                return ApiResult<TagDto>.Failure($"Thẻ phân loại tên '{request.Name}' đã tồn tại");

            var tag = request.Adapt<Tag>();
            await _unitOfWork.TagRepository.AddAsync(tag);
            await _unitOfWork.SaveChangesAsync();
            var tagDto = tag.Adapt<TagDto>();
            return ApiResult<TagDto>.Success(tagDto);
        }
    }
}
