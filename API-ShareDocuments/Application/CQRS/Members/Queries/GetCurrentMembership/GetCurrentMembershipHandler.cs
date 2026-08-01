using Application.Common;
using Application.CQRS.Members.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Members.Queries.GetCurrentMembership
{
    public class GetCurrentMembershipHandler : IRequestHandler<GetCurrentMembershipQuery, ApiResult<MembershipDto?>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public GetCurrentMembershipHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<MembershipDto?>> Handle(GetCurrentMembershipQuery request, CancellationToken cancellationToken)
        {
            var membership = await _unitOfWork.MembershipRepository
                .GetByCondition(
                    m => m.UserId == _currentUser.Id!.Value,
                    q => q.OrderByDescending(m => m.EndDate))
                .ProjectToType<MembershipDto>()
                .FirstOrDefaultAsync(cancellationToken);

            return ApiResult<MembershipDto?>.Success(membership);
        }
    }
}
