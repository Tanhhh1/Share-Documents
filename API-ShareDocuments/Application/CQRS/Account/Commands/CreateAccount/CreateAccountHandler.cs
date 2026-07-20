using Application.Common;
using Application.CQRS.Account.DTOs;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Account.Commands.CreateAccount
{
    public class CreateAccountHandler : IRequestHandler<CreateAccountCommand, ApiResult<AccountDto>>
    {
        private readonly UserManager<User> _userManager;
        private const string DefaultRole = "Moderator";
        public CreateAccountHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        public async Task<ApiResult<AccountDto>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        {
            var existingByUsername = await _userManager.FindByNameAsync(request.UserName);
            if (existingByUsername is not null)
                return ApiResult<AccountDto>.Failure([new FieldError("UserName", "Tên đăng nhập đã tồn tại trong hệ thống")]);

            var existingByEmail = await _userManager.FindByEmailAsync(request.Email);
            if (existingByEmail is not null)
                return ApiResult<AccountDto>.Failure([new FieldError("Email", "Email đã tồn tại trong hệ thống")]);

            var user = request.Adapt<User>();

            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
            {
                var errors = createResult.Errors.Select(e => new FieldError(null, e.Description));
                return ApiResult<AccountDto>.Failure(errors);
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, DefaultRole);
            if (!addRoleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                var errors = addRoleResult.Errors.Select(e => new FieldError(null, e.Description));
                return ApiResult<AccountDto>.Failure(errors);
            }

            var userDto = user.Adapt<AccountDto>();
            userDto.Roles = new List<string> { DefaultRole };

            return ApiResult<AccountDto>.Success(userDto);
        }
    }
}
