using Application.Common;
using Application.CQRS.Payments.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Mapster;
using MediatR;

namespace Application.CQRS.Payments.Commands.CreatePayment
{
    public class CreatePaymentHandler : IRequestHandler<CreatePaymentCommand, ApiResult<PaymentResultDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPayOSService _payOSService;
        private readonly ICurrentUser _currentUser;

        public CreatePaymentHandler(IUnitOfWork unitOfWork, IPayOSService payOSService, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _payOSService = payOSService;
            _currentUser = currentUser;
        }

        private static readonly Dictionary<MembershipPlan, decimal> PlanPrices = new()
        {
            { MembershipPlan.Monthly, 49000m },
            { MembershipPlan.Yearly, 499000m }
        };

        public async Task<ApiResult<PaymentResultDto>> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
        {
            if (!PlanPrices.TryGetValue(request.Plan, out var amount))
                return ApiResult<PaymentResultDto>.Failure("Gói membership không hợp lệ");

            var orderCode = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            var payment = new Payment
            {
                UserId = _currentUser.Id!.Value,
                Amount = amount,
                Plan = request.Plan,
                Status = PaymentStatus.Pending,
                OrderCode = orderCode
            };

            await _unitOfWork.PaymentRepository.AddAsync(payment);

            var payOSResult = await _payOSService.CreatePaymentLinkAsync(new PayOSCreatePaymentRequest
            {
                OrderCode = orderCode,
                Amount = (long)amount,
                Description = $"Thanh toan {orderCode}",
            }, cancellationToken);

            var paymentDto = payOSResult.Adapt<PaymentResultDto>();

            return ApiResult<PaymentResultDto>.Success(paymentDto);
        }
    }
}
