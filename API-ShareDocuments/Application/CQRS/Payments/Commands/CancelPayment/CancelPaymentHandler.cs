using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Payments.Commands.CancelPayment
{
    public class CancelPaymentHandler : IRequestHandler<CancelPaymentCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPayOSService _payOSService;
        private readonly ICurrentUser _currentUser;

        public CancelPaymentHandler(IUnitOfWork unitOfWork, IPayOSService payOSService, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _payOSService = payOSService;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(CancelPaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _unitOfWork.PaymentRepository
                .GetByCondition(p => p.OrderCode == request.OrderCode)
                .FirstOrDefaultAsync(cancellationToken);

            if (payment is null)
                return ApiResult<bool>.Failure("Không tìm thấy đơn thanh toán");

            if (payment.UserId != _currentUser.Id!.Value)
                return ApiResult<bool>.Failure("Bạn không có quyền hủy đơn thanh toán này");

            if (payment.Status != PaymentStatus.Pending)
                return ApiResult<bool>.Failure("Chỉ có thể hủy đơn thanh toán đang chờ xử lý");

            await _payOSService.CancelPaymentLinkAsync(request.OrderCode, cancellationToken);

            payment.Status = PaymentStatus.Cancelled;
            _unitOfWork.PaymentRepository.Update(payment);

            return ApiResult<bool>.Success(true);
        }
    }
}
