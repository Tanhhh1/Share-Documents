using Application.Common;
using Application.Interfaces.Services;
using Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.CQRS.Auth.Commands.ForgotPassword
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, ApiResult<string>>
    {
        private readonly UserManager<User> _userManager;
        private readonly IOtpService _otpService;
        private readonly IEmailService _emailService;

        public ForgotPasswordHandler(UserManager<User> userManager, IOtpService otpService, IEmailService emailService)
        {
            _userManager = userManager;
            _otpService = otpService;
            _emailService = emailService;
        }

        public async Task<ApiResult<string>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return ApiResult<string>.Failure("Email không tồn tại trong hệ thống");
            }

            var otp = await _otpService.GenerateOtpAsync(request.Email, cancellationToken);

            var emailModel = new OtpEmailModel
            {
                ToEmail = request.Email,
                UserFullName = user.FullName ?? user.UserName ?? string.Empty,
                Otp = otp
            };

            await _emailService.SendOtpEmailAsync(emailModel, cancellationToken);

            return ApiResult<string>.Success("Mã OTP đã được gửi đến email của bạn");
        }
    }
}
