using Application.Common;
using Application.CQRS.Profile.DTOs;
using Application.Interfaces.Services;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Profile.Commands.UpdateInformation
{
    public class UpdateInforHandler : IRequestHandler<UpdateInforCommand, ApiResult<ProfileDto>>
    {
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUser _currentUser;

        public UpdateInforHandler(UserManager<User> userManager, ICurrentUser currentUser)
        {
            _userManager = userManager;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<ProfileDto>> Handle(UpdateInforCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<ProfileDto>.Failure("Người dùng chưa đăng nhập");

            var user = await _userManager.FindByIdAsync(_currentUser.Id.Value.ToString());
            if (user is null)
                return ApiResult<ProfileDto>.Failure("Tài khoản không tồn tại");

            var existingByEmail = await _userManager.FindByEmailAsync(request.Email!);
            if (existingByEmail is not null && existingByEmail.Id != _currentUser.Id)
                return ApiResult<ProfileDto>.Failure("Email đã được sử dụng bởi tài khoản khác");

            request.Adapt(user);

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(e => new FieldError(null, e.Description));
                return ApiResult<ProfileDto>.Failure(errors);
            }

            var userDto = user.Adapt<ProfileDto>();
            userDto.UpdatedAt = DateTime.UtcNow;
            return ApiResult<ProfileDto>.Success(userDto);
        }
    }
}
