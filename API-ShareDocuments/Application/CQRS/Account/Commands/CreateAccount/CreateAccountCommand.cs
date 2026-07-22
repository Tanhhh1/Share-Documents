using Application.Common;
using Application.CQRS.Account.DTOs;
using MediatR;

namespace Application.CQRS.Account.Commands.CreateAccount
{
    public class CreateAccountCommand : IRequest<ApiResult<AccountDto>>
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
    }
}
