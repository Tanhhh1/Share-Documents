using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Queries.GetAllGroup
{
    public class GetAllGroupHandler : IRequestHandler<GetAllGroupQuery, ApiResult<PageList<DocumentGroupDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetAllGroupHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<PageList<DocumentGroupDto>>> Handle(GetAllGroupQuery request, CancellationToken cancellationToken)
        {
            var documentGroups = _unitOfWork.DocumentGroupRepository.GetByCondition().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var keyword = request.Search.Trim();
                documentGroups = documentGroups.Where(g => g.Title.Contains(keyword));
            }

            if (request.Status.HasValue)
                documentGroups = documentGroups.Where(g => g.Status == request.Status.Value);

            if (request.IsDeleted.HasValue)
                documentGroups = documentGroups.Where(g => g.IsDeleted == request.IsDeleted.Value);

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
