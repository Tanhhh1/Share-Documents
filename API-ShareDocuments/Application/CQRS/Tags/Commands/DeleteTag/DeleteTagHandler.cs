using Application.Common;
using Application.CQRS.Tags.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Tags.Commands.DeleteTag
{
    public class DeleteTagHandler : IRequestHandler<DeleteTagCommand, ApiResult<TagDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public DeleteTagHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<TagDto>> Handle(DeleteTagCommand request, CancellationToken cancellationToken)
        {
            var tag = await _unitOfWork.TagRepository.GetByIdAsync(request.Id);
            if (tag is null)
                return ApiResult<TagDto>.Failure("Không tìm thấy thẻ phân loại");
            tag.IsDeleted = true;
            _unitOfWork.TagRepository.Update(tag);
            var tagDto = tag.Adapt<TagDto>();
            return ApiResult<TagDto>.Success(tagDto);
        }
    }
}
