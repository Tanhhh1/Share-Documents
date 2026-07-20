using Application.Common;
using Application.CQRS.Account.DTOs;
using MediatR;

namespace Application.CQRS.Account.Commands.UpdateAccount
{
    public class UpdateAccountCommand : IRequest<ApiResult<AccountDto>>
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? PhoneNumber { get; set; }
    }
}
