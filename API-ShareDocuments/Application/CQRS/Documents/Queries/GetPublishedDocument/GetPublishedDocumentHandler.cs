using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
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
        private readonly ISupabaseStorageService _storageService;
        public GetPublishedDocumentHandler(IUnitOfWork unitOfWork, ISupabaseStorageService storageService)
        {
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }

        public async Task<ApiResult<PageList<DocumentDto>>> Handle(GetPublishedDocumentQuery request, CancellationToken cancellationToken)
        {
            var documents = _unitOfWork.DocumentRepository.GetByCondition().AsNoTracking();
            documents = documents.Where(d => d.Status == DocumentStatus.Published && !d.IsDeleted);

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword.Trim().ToLower();
                documents = documents.Where(d => d.Title.ToLower().Contains(keyword));
            }
            if (request.SubjectId.HasValue)
                documents = documents.Where(d => d.SubjectId == request.SubjectId.Value);

            if (request.TagIds != null && request.TagIds.Any())
            {
                var distinctTagIds = request.TagIds.Distinct().ToList();
                documents = documents.Where(d => d.Tags.Any(t => distinctTagIds.Contains(t.Id)));
            }

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

            foreach (var item in pageList.Items)
            {
                if (!string.IsNullOrEmpty(item.ThumbnailUrl))
                    item.ThumbnailUrl = _storageService.GetPublicUrl(item.ThumbnailUrl);
            }

            return ApiResult<PageList<DocumentDto>>.Success(pageList);
        }
    }
}
