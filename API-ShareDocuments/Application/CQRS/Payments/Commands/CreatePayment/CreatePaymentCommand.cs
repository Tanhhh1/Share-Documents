using Application.Common;
using Application.CQRS.Payments.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.CQRS.Payments.Commands.CreatePayment
{
    public class CreatePaymentCommand : IRequest<ApiResult<PaymentResultDto>>
    {
        public MembershipPlan Plan { get; set; }
    }
}
