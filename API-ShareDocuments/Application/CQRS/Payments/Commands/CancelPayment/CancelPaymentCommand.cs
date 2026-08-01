using Application.Common;
using MediatR;

namespace Application.CQRS.Payments.Commands.CancelPayment
{
    public class CancelPaymentCommand : IRequest<ApiResult<bool>>
    {
        public long OrderCode { get; set; }
    }
}
