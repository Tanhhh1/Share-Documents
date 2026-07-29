using Application.Common;
using Application.CQRS.Profile.DTOs;
using Application.Interfaces.Services;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Profile.Queries.GetByUserId
{
    public class GetMyProfileHandler : IRequestHandler<GetMyProfileQuery, ApiResult<ProfileDto>>
    {
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUser _currentUser;

        public GetMyProfileHandler(UserManager<User> userManager, ICurrentUser currentUser)
        {
            _userManager = userManager;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<ProfileDto>> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(_currentUser.Id.ToString()!);
            if (user is null)
                return ApiResult<ProfileDto>.Failure("Không tìm thấy người dùng");

            var userDto = user.Adapt<ProfileDto>();
            return ApiResult<ProfileDto>.Success(userDto);
        }
    }
}
