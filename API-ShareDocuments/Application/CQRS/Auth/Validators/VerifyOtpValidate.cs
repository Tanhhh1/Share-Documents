using Application.CQRS.Auth.Commands.VerifyOtp;
using FluentValidation;

namespace Application.CQRS.Auth.Validators
{
    public class VerifyOtpValidate : AbstractValidator<VerifyOtpCommand>
    {
        public VerifyOtpValidate()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không đúng định dạng");

            RuleFor(x => x.Otp)
                .NotEmpty().WithMessage("Mã OTP không được để trống")
                .Length(6).WithMessage("Mã OTP phải gồm 6 chữ số")
                .Matches("^[0-9]+$").WithMessage("Mã OTP chỉ được chứa chữ số");
        }
    }
}
