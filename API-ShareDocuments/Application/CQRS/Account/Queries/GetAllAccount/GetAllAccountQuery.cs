using Application.Common;
using Application.CQRS.Account.DTOs;
using MediatR;

namespace Application.CQRS.Account.Queries.GetAllAccount
{
    public class GetAllAccountQuery : IRequest<ApiResult<PageList<AccountDto>>>
    {
        public string? Search { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
