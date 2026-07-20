using Application.Common;
using Application.CQRS.Account.DTOs;
using MediatR;

namespace Application.CQRS.Account.Queries.GetByAccountId
{
    public class GetByAccountIdQuery : IRequest<ApiResult<AccountDto>>
    {
        public int Id { get; set; }
    }
}
