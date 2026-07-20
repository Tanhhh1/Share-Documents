using Application.Common;
using Application.Interfaces.Services;
using Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Profile.Commands.UpdatePassword
{
    public class UpdatePasswordHandler : IRequestHandler<UpdatePasswordCommand, ApiResult<bool>>
    {
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUser _currentUser;

        public UpdatePasswordHandler(UserManager<User> userManager, ICurrentUser currentUser)
        {
            _userManager = userManager;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<bool>.Failure("Người dùng chưa đăng nhập");

            var user = await _userManager.FindByIdAsync(_currentUser.Id.Value.ToString());
            if (user is null)
                return ApiResult<bool>.Failure("Tài khoản không tồn tại");

            var isCurrentPassword = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
            if (!isCurrentPassword)
                return ApiResult<bool>.Failure("Mật khẩu hiện tại không đúng");

            var changeResult = await _userManager.ChangePasswordAsync(
                user, request.CurrentPassword, request.NewPassword);

            if (!changeResult.Succeeded)
            {
                var errors = changeResult.Errors.Select(e => new FieldError(null, e.Description));
                return ApiResult<bool>.Failure(errors);
            }

            return ApiResult<bool>.Success(true);
        }
    }
}

