using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Queries.GetByUserId
{
    public class GetGroupByUserIdHandler : IRequestHandler<GetGroupByUserIdQuery, ApiResult<PageList<DocumentGroupDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public GetGroupByUserIdHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<PageList<DocumentGroupDto>>> Handle(GetGroupByUserIdQuery request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<PageList<DocumentGroupDto>>.Failure("Người dùng chưa đăng nhập");

            var query = _unitOfWork.DocumentGroupRepository.GetByCondition().AsNoTracking();
            query = query.Where(g => g.UserId == _currentUser.Id.Value);

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
