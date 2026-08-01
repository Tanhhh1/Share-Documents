using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Documents.Queries.GetMyDocument
{
    public class GetMyDocumentHandler : IRequestHandler<GetMyDocumentQuery, ApiResult<PageList<DocumentDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public GetMyDocumentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<PageList<DocumentDto>>> Handle(GetMyDocumentQuery request, CancellationToken cancellationToken)
        {
            var query = _unitOfWork.DocumentRepository.GetByCondition();

            query = query.Where(d => d.UserId == _currentUser.Id);

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword.Trim();
                query = query.Where(d => d.Title.Contains(keyword));
            }

            if (request.SubjectId.HasValue)
                query = query.Where(d => d.SubjectId == request.SubjectId.Value);

            if (request.TagId.HasValue)
                query = query.Where(d => d.Tags.Any(t => t.Id == request.TagId.Value));

            if (request.GroupId.HasValue)
                query = query.Where(d => d.GroupId == request.GroupId.Value);

            if (request.Status.HasValue)
                query = query.Where(d => d.Status == request.Status.Value);

            if (request.IsDeleted.HasValue)
                query = query.Where(d => d.IsDeleted == request.IsDeleted.Value);

            query = query.OrderByDescending(d => d.CreatedAt);

            var pageList = await PageList<DocumentDto>.ToPagedListAsync(
                query.ProjectToType<DocumentDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<DocumentDto>>.Success(pageList);
        }
    }
}
