using Application.Common;
using Application.CQRS.Account.DTOs;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Account.Queries.GetAllAccount
{
    public class GetAllAccountHandler : IRequestHandler<GetAllAccountQuery, ApiResult<PageList<AccountDto>>>
    {
        private readonly UserManager<User> _userManager;

        public GetAllAccountHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ApiResult<PageList<AccountDto>>> Handle(GetAllAccountQuery request, CancellationToken cancellationToken)
        {
            var users = _userManager.Users.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var keyword = request.Search.Trim().ToLower();
                users = users.Where(u => u.UserName!.ToLower().Contains(keyword) || u.FullName.ToLower().Contains(keyword) || u.Email!.ToLower().Contains(keyword));
            }

            if (!string.IsNullOrWhiteSpace(request.Role))
            {
                var roleName = request.Role.Trim().ToLower();
                users = users.Where(u => u.UserRoles.Any(ur => ur.Role.Name!.ToLower() == roleName));
            }

            if (request.IsActive.HasValue)
            {
                var now = DateTimeOffset.UtcNow;
                users = users.Where(u => u.IsActive == request.IsActive.Value);
            }

            users = users.OrderByDescending(u => u.CreatedAt);

            var pageList = await PageList<AccountDto>.ToPagedListAsync(
                users.ProjectToType<AccountDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<AccountDto>>.Success(pageList);
        }
    }
}