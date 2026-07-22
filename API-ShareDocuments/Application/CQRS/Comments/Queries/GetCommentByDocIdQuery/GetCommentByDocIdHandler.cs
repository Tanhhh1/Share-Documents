using Application.Common;
using Application.CQRS.Comments.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Comments.Queries.GetCmtByDocIdQuery
{
    public class GetCommentByDocIdHandler : IRequestHandler<GetCommentByDocIdQuery, ApiResult<PageList<CommentDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetCommentByDocIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<PageList<CommentDto>>> Handle(GetCommentByDocIdQuery request, CancellationToken cancellationToken)
        {
            var listComment = _unitOfWork.CommentRepository
                .GetByCondition(
                    c => c.DocumentId == request.Id && c.ParentCommentId == null && !c.IsDeleted,
                    q => q.OrderByDescending(c => c.CreatedAt))
                .ProjectToType<CommentDto>();

            var pageList = await PageList<CommentDto>.ToPagedListAsync(
                listComment,
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            if (pageList.Items.Count > 0)
            {
                var allReplies = await _unitOfWork.CommentRepository
                    .GetByCondition(
                        c => c.DocumentId == request.Id && !c.IsDeleted && c.ParentCommentId != null,
                        q => q.OrderBy(c => c.CreatedAt))
                    .ProjectToType<CommentDto>()
                    .ToListAsync(cancellationToken);
                BuildReplyTree(pageList.Items.ToList(), allReplies);
            }

            return ApiResult<PageList<CommentDto>>.Success(pageList);
        }

        private static void BuildReplyTree(List<CommentDto> roots, List<CommentDto> allReplies)
        {
            var lookup = allReplies.ToLookup(r => r.ParentCommentId);
            void Attach(CommentDto parent)
            {
                parent.Replies = lookup[parent.Id].ToList();
                foreach (var child in parent.Replies)
                    Attach(child);
            }
            foreach (var root in roots)
                Attach(root);
        }
    }
}