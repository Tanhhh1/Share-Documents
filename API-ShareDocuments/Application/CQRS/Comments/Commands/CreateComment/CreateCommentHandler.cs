using Application.Common;
using Application.CQRS.Comments.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Comments.Commands.CreateComment
{
    public class CreateCommentHandler : IRequestHandler<CreateCommentCommand, ApiResult<CommentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public CreateCommentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }
        public async Task<ApiResult<CommentDto>> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<CommentDto>.Failure("Người dùng chưa đăng nhập");

            if (request.ParentCommentId.HasValue)
            {
                var parentExists = await _unitOfWork.CommentRepository
                    .GetByCondition(c => c.Id == request.ParentCommentId.Value && c.DocumentId == request.DocumentId && !c.IsDeleted)
                    .AnyAsync(cancellationToken);
                if (!parentExists)
                    return ApiResult<CommentDto>.Failure("Bình luận cha không tồn tại hoặc đã bị xóa");
            }

            var comment = request.Adapt<Domain.Entities.Comment>();
            comment.UserId = _currentUser.Id.Value;
            await _unitOfWork.CommentRepository.AddAsync(comment);
            await _unitOfWork.SaveChangesAsync();
            var commentDto = comment.Adapt<CommentDto>();

            return ApiResult<CommentDto>.Success(commentDto);
        }
    }
}
