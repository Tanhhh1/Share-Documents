using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Documents.Queries.GetPublishedDocument
{
    public class GetPublishedDocumentHandler : IRequestHandler<GetPublishedDocumentQuery, ApiResult<PageList<DocumentDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetPublishedDocumentHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<PageList<DocumentDto>>> Handle(GetPublishedDocumentQuery request, CancellationToken cancellationToken)
        {
            var documents = _unitOfWork.DocumentRepository.GetByCondition().AsNoTracking();
            documents = documents.Where(d => d.Status == DocumentStatus.Published && !d.IsDeleted);

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword.Trim();
                documents = documents.Where(d => d.Title.Contains(keyword));
            }
            if (request.SubjectId.HasValue)
                documents = documents.Where(d => d.SubjectId == request.SubjectId.Value);
            if (request.TagId.HasValue)
                documents = documents.Where(d => d.Tags.Any(t => t.Id == request.TagId.Value));
            if (request.GroupId.HasValue)
                documents = documents.Where(d => d.GroupId == request.GroupId.Value);
            if (request.AccessLevel.HasValue)
                documents = documents.Where(d => d.AccessLevel == request.AccessLevel.Value);
            documents = documents.OrderByDescending(d => d.CreatedAt);

            var pageList = await PageList<DocumentDto>.ToPagedListAsync(
                documents.ProjectToType<DocumentDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<DocumentDto>>.Success(pageList);
        }
    }
}
