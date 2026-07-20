using Application.Common;
using Application.CQRS.Account.DTOs;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Account.Queries.GetByAccountId
{
    public class GetByAccountIdHandler : IRequestHandler<GetByAccountIdQuery, ApiResult<AccountDto>>
    {
        private readonly UserManager<User> _userManager;

        public GetByAccountIdHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ApiResult<AccountDto>> Handle(GetByAccountIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.Id.ToString());
            if (user is null)
                return ApiResult<AccountDto>.Failure("Tài khoản không tồn tại");

            var roles = await _userManager.GetRolesAsync(user);

            var userDto = user.Adapt<AccountDto>();
            userDto.Roles = roles;

            return ApiResult<AccountDto>.Success(userDto);
        }
    }
}
