using Application.Common;
using MediatR;

namespace Application.CQRS.Auth.Commands.VerifyOtp
{
    public class VerifyOtpCommand : IRequest<ApiResult<string>>
    {
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}
