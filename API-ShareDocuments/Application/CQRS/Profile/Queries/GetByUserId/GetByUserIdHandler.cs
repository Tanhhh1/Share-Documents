using Application.Common;
using Application.CQRS.Profile.DTOs;
using Application.Interfaces.Services;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Profile.Queries.GetByUserId
{
    public class GetByUserIdHandler : IRequestHandler<GetByUserIdQuery, ApiResult<ProfileDto>>
    {
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUser _currentUser;

        public GetByUserIdHandler(UserManager<User> userManager, ICurrentUser currentUser)
        {
            _userManager = userManager;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<ProfileDto>> Handle(GetByUserIdQuery request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<ProfileDto>.Failure("Người dùng chưa đăng nhập");

            var user = await _userManager.FindByIdAsync(_currentUser.Id.ToString()!);
            if (user is null)
                return ApiResult<ProfileDto>.Failure("Không tìm thấy người dùng");

            var userDto = user.Adapt<ProfileDto>();
            return ApiResult<ProfileDto>.Success(userDto);
        }
    }
}
