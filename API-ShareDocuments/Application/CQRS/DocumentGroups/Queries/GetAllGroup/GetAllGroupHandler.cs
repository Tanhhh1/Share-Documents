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
            var query = _unitOfWork.DocumentGroupRepository.GetByCondition().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var keyword = request.Search.Trim();
                query = query.Where(g => g.Title.Contains(keyword));
            }

            if (request.Status.HasValue)
                query = query.Where(g => g.Status == request.Status.Value);

            if (request.IsDeleted.HasValue)
                query = query.Where(g => g.IsDeleted == request.IsDeleted.Value);

            query = query.OrderByDescending(g => g.Id);

            var pageList = await PageList<DocumentGroupDto>.ToPagedListAsync(
                query.ProjectToType<DocumentGroupDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<DocumentGroupDto>>.Success(pageList);
        }
    }
}
