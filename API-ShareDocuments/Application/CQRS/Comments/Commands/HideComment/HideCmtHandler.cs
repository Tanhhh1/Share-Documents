using Application.Common;
using Application.Interfaces.UnitOfWork;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Comments.Commands.HideComment
{
    public class HideCmtHandler : IRequestHandler<HideCmtCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public HideCmtHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<bool>> Handle(HideCmtCommand request, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.CommentRepository
                .GetByCondition(c => c.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (comment is null)
                return ApiResult<bool>.Failure("Không tìm thấy bình luận");

            if (comment.IsDeleted)
                return ApiResult<bool>.Failure("Bình luận đã được ẩn trước đó");

            comment.IsDeleted = true;
            _unitOfWork.CommentRepository.Update(comment);
            return ApiResult<bool>.Success(true);
        }
    }
}
