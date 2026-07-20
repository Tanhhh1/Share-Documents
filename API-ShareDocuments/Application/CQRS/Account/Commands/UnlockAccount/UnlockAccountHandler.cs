using Application.Common;
using Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Account.Commands.UnlockAccount
{
    public class UnlockAccountHandler : IRequestHandler<UnlockAccountCommand, ApiResult<bool>>
    {
        private readonly UserManager<User> _userManager;
        public UnlockAccountHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ApiResult<bool>> Handle(UnlockAccountCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.Id.ToString());
            if (user == null)
                return ApiResult<bool>.Failure("Tài khoản không tồn tại");

            if (user.IsActive)
                return ApiResult<bool>.Failure("Tài khoản đang hoạt động, không cần mở khoá");

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(e => new FieldError(null, e.Description));
                return ApiResult<bool>.Failure(errors);
            }

            return ApiResult<bool>.Success(true);
        }
    }
}
