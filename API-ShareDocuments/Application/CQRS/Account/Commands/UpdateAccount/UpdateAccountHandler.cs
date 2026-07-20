using Application.Common;
using Application.CQRS.Account.DTOs;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Account.Commands.UpdateAccount
{
    public class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, ApiResult<AccountDto>>
    {
        private readonly UserManager<User> _userManager;

        public UpdateAccountHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        public async Task<ApiResult<AccountDto>> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.Id.ToString());
            if (user is null)
                return ApiResult<AccountDto>.Failure("Tài khoản không tồn tại");

            var existingByUsername = await _userManager.FindByNameAsync(request.UserName);
            if (existingByUsername is not null && existingByUsername.Id != user.Id)
                return ApiResult<AccountDto>.Failure([new FieldError("UserName", "Tên đăng nhập đã tồn tại trong hệ thống")]);

            var existingByEmail = await _userManager.FindByEmailAsync(request.Email);
            if (existingByEmail is not null && existingByEmail.Id != user.Id)
                return ApiResult<AccountDto>.Failure([new FieldError("Email", "Email đã tồn tại trong hệ thống")]);

            request.Adapt(user);
            user.UpdatedAt = DateTime.UtcNow;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(e => new FieldError(null, e.Description));
                return ApiResult<AccountDto>.Failure(errors);
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userDto = user.Adapt<AccountDto>();
            userDto.Roles = roles;

            return ApiResult<AccountDto>.Success(userDto);
        }
    }
}
