using Application.Common;
using MediatR;

namespace Application.CQRS.Account.Commands.LockAccount
{
    public class LockAccountCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}
