using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Comments.Commands.DeleteComment
{
    public class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public DeleteCommentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<bool>.Failure("Người dùng chưa đăng nhập");

            var comment = await _unitOfWork.CommentRepository
                .GetByCondition(c => c.Id == request.Id)
                .Include(c => c.Replies)
                .FirstOrDefaultAsync(cancellationToken);

            if (comment is null)
                return ApiResult<bool>.Failure("Không tìm thấy bình luận");

            if (comment.UserId != _currentUser.Id.Value)
                return ApiResult<bool>.Failure("Bạn không có quyền xóa bình luận này");

            if (comment.Replies.Count > 0)
                return ApiResult<bool>.Failure("Không thể xóa bình luận đang có phản hồi");

            _unitOfWork.CommentRepository.Delete(comment);
            return ApiResult<bool>.Success(true);
        }
    }
}
