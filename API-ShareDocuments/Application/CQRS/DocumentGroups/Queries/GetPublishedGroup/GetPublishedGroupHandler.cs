using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Queries.GetPublishedGroup
{
    public class GetPublishedGroupHandler : IRequestHandler<GetPublishedGroupQuery, ApiResult<PageList<DocumentGroupDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetPublishedGroupHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<PageList<DocumentGroupDto>>> Handle(GetPublishedGroupQuery request, CancellationToken cancellationToken)
        {
            var documentGroups = _unitOfWork.DocumentGroupRepository.GetByCondition().AsNoTracking();
            documentGroups = documentGroups.Where(g => g.Status == DocumentStatus.Published && !g.IsDeleted);

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var keyword = request.Search.Trim();
                documentGroups = documentGroups.Where(g => g.Title.Contains(keyword));
            }
            documentGroups = documentGroups.OrderByDescending(g => g.Id);

            var pageList = await PageList<DocumentGroupDto>.ToPagedListAsync(
                documentGroups.ProjectToType<DocumentGroupDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<DocumentGroupDto>>.Success(pageList);
        }
    }
}
