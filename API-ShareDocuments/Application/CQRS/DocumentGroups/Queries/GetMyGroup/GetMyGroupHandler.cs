using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Queries.GetByUserId
{
    public class GetMyGroupHandler : IRequestHandler<GetMyGroupQuery, ApiResult<PageList<DocumentGroupDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public GetMyGroupHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<PageList<DocumentGroupDto>>> Handle(GetMyGroupQuery request, CancellationToken cancellationToken)
        {
            var documentGroup = _unitOfWork.DocumentGroupRepository.GetByCondition().AsNoTracking();
            documentGroup = documentGroup.Where(g => g.UserId == _currentUser.Id!.Value);

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var keyword = request.Search.Trim();
                documentGroup = documentGroup.Where(g => g.Title.Contains(keyword));
            }
            if (request.Status.HasValue)
                documentGroup = documentGroup.Where(g => g.Status == request.Status.Value);
            if (request.IsDeleted.HasValue)
                documentGroup = documentGroup.Where(g => g.IsDeleted == request.IsDeleted.Value);

            documentGroup = documentGroup.OrderByDescending(g => g.Id);

            var pageList = await PageList<DocumentGroupDto>.ToPagedListAsync(
                documentGroup.ProjectToType<DocumentGroupDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<DocumentGroupDto>>.Success(pageList);
        }
    }
}
