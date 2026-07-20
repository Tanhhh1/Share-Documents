using Application.Common;
using MediatR;

namespace Application.CQRS.Account.Commands.UnlockAccount
{
    public class UnlockAccountCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}
