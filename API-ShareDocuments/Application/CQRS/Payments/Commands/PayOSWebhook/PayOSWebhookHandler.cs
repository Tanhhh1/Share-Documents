using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Payments.Commands.PayOSWebhook
{
    public class PayOSWebhookHandler : IRequestHandler<PayOSWebhookCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPayOSService _payOSService;
        private readonly IEmailService _emailService;
        private readonly UserManager<User> _userManager;
        public PayOSWebhookHandler(IUnitOfWork unitOfWork, IPayOSService payOSService, IEmailService emailService, UserManager<User> userManager)
        {
            _unitOfWork = unitOfWork;
            _payOSService = payOSService;
            _emailService = emailService;
            _userManager = userManager;
        }

        public async Task<ApiResult<bool>> Handle(PayOSWebhookCommand request, CancellationToken cancellationToken)
        {
            var webhookResult = await _payOSService.VerifyWebhookAsync(request.RawBody);

            var payment = await _unitOfWork.PaymentRepository
                .GetByCondition(p => p.OrderCode == webhookResult.OrderCode)
                .FirstOrDefaultAsync(cancellationToken);

            if (payment is null)
                return ApiResult<bool>.Failure("Không tìm thấy đơn thanh toán tương ứng");

            if (payment.Status == PaymentStatus.Success)
                return ApiResult<bool>.Success(true);

            if (!webhookResult.Success)
            {
                if (payment.Status != PaymentStatus.Failed)
                {
                    payment.Status = PaymentStatus.Failed;
                    _unitOfWork.PaymentRepository.Update(payment);
                }
                return ApiResult<bool>.Success(true);
            }

            payment.Status = PaymentStatus.Success;
            payment.TransactionId = webhookResult.Reference;
            payment.PaidAt = DateTime.UtcNow;
            _unitOfWork.PaymentRepository.Update(payment);

            var membership = await CreateOrExtendMembershipAsync(payment, cancellationToken);

            var user = await _userManager.FindByIdAsync(payment.UserId.ToString());
            if (user is not null)
            {
                user.IsMember = true;
                user.MemberExpiresAt = membership.EndDate;
                await _userManager.UpdateAsync(user);
                await _emailService.SendPaymentSuccessEmailAsync(new PaymentSuccessEmailModel
                {
                    ToEmail = user.Email!,
                    UserFullName = user.FullName,
                    PlanName = payment.Plan.ToString(),
                    Amount = payment.Amount,
                    StartDate = membership.StartDate,
                    EndDate = membership.EndDate,
                    OrderCode = payment.OrderCode
                }, cancellationToken);
            }

            return ApiResult<bool>.Success(true);
        }

        private async Task<Membership> CreateOrExtendMembershipAsync(Payment payment, CancellationToken cancellationToken)
        {
            var duration = payment.Plan == MembershipPlan.Monthly ? TimeSpan.FromDays(30) : TimeSpan.FromDays(365);

            var latestMembership = await _unitOfWork.MembershipRepository
                .GetByCondition(m => m.UserId == payment.UserId, q => q.OrderByDescending(m => m.EndDate))
                .FirstOrDefaultAsync(cancellationToken);

            var now = DateTime.UtcNow;
            var startDate = latestMembership is not null && latestMembership.EndDate > now ? latestMembership.EndDate : now;

            var membership = new Membership
            {
                UserId = payment.UserId,
                PlanCode = payment.Plan,
                Price = payment.Amount,
                StartDate = startDate,
                EndDate = startDate.Add(duration),
                Status = MembershipStatus.Active,
                PaymentId = payment.Id
            };

            await _unitOfWork.MembershipRepository.AddAsync(membership);

            return membership;
        }
    }
}
