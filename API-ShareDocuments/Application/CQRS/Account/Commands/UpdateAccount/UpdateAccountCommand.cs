using Application.Common;
using Application.CQRS.Account.DTOs;
using MediatR;

namespace Application.CQRS.Account.Commands.UpdateAccount
{
    public class UpdateAccountCommand : IRequest<ApiResult<AccountDto>>
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
    }
}
