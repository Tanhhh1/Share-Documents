using Application.Common;
using Application.CQRS.Payments.DTOs;
using MediatR;

namespace Application.CQRS.Payments.Queries.GetPaymentHistory
{
    public class GetPaymentHistoryQuery : IRequest<ApiResult<PageList<PaymentDto>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
