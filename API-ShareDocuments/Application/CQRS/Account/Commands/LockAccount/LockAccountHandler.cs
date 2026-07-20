using Application.Common;
using Application.Interfaces.Services;
using Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Account.Commands.LockAccount
{
    public class LockAccountHandler : IRequestHandler<LockAccountCommand, ApiResult<bool>>
    {
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUser _currentUser;

        public LockAccountHandler(UserManager<User> userManager, ICurrentUser currentUser)
        {
            _userManager = userManager;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(LockAccountCommand request, CancellationToken cancellationToken)
        {
            if (_currentUser.IsAuthenticated && _currentUser.Id == request.Id)
                return ApiResult<bool>.Failure("Không thể tự khoá tài khoản của chính mình");

            var user = await _userManager.FindByIdAsync(request.Id.ToString());
            if (user == null)
                return ApiResult<bool>.Failure("Tài khoản không tồn tại");

            if (!user.IsActive)
                return ApiResult<bool>.Failure("Tài khoản đã bị khoá trước đó");

            user.IsActive = false;
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
