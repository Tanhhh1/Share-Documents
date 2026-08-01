using Application.Common;
using Application.Interfaces.Services;
using Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;


namespace Application.CQRS.Auth.Commands.VerifyOtp
{
    public class VerifyOtpHandler : IRequestHandler<VerifyOtpCommand, ApiResult<string>>
    {
        private readonly UserManager<User> _userManager;
        private readonly IOtpService _otpService;

        public VerifyOtpHandler(UserManager<User> userManager, IOtpService otpService)
        {
            _userManager = userManager;
            _otpService = otpService;
        }

        public async Task<ApiResult<string>> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return ApiResult<string>.Failure("Email không tồn tại trong hệ thống");

            var isOtpValid = await _otpService.VerifyOtpAsync(request.Email, request.Otp, cancellationToken);
            if (!isOtpValid)
                return ApiResult<string>.Failure("Mã OTP không đúng hoặc đã hết hạn");

            var rawToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(rawToken));

            return ApiResult<string>.Success(encodedToken);
        }
    }
}
