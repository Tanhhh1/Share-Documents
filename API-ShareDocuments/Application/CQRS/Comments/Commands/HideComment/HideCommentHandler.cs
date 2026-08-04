using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Domain.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Comments.Commands.HideComment
{
    public class HideCommentHandler : IRequestHandler<HideCommentCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public HideCommentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(HideCommentCommand request, CancellationToken cancellationToken)
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
            comment.AddDomainEvent(new CommentModeratedEvent(
                comment.Id, comment.UserId, _currentUser.Id!.Value, ModerationAction.Hide ));
            return ApiResult<bool>.Success(true);
        }
    }
}
