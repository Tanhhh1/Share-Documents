using Application.Common;
using Application.CQRS.Comments.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Comments.Queries.GetAllCmt
{
    public class GetAllCommentHandler : IRequestHandler<GetAllCommentQuery, ApiResult<PageList<ListCommentDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllCommentHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<PageList<ListCommentDto>>> Handle(GetAllCommentQuery request, CancellationToken cancellationToken)
        {
            var comments = _unitOfWork.CommentRepository.GetByCondition().AsNoTracking();

            if (!string.IsNullOrEmpty(request.Keyword))
            {
                var keyword = request.Keyword.Trim();
                comments = comments.Where(c => c.Content.Contains(keyword));
            }

            if (request.FromDate.HasValue)
                comments = comments.Where(c => c.CreatedAt >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                comments = comments.Where(c => c.CreatedAt <= request.ToDate.Value);

            if (request.UserId.HasValue)
                comments = comments.Where(c => c.UserId == request.UserId.Value);

            if (request.IsDeleted.HasValue)
                comments = comments.Where(c => c.IsDeleted == request.IsDeleted.Value);

            comments = comments.OrderByDescending(c => c.CreatedAt);

            var pageList = await PageList<ListCommentDto>.ToPagedListAsync(
                comments.ProjectToType<ListCommentDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken);

            return ApiResult<PageList<ListCommentDto>>.Success(pageList);
        }
    }
}
