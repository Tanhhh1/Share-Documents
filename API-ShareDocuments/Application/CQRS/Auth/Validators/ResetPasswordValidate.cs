using Application.CQRS.Auth.Commands.ResetPassword;
using FluentValidation;

namespace Application.CQRS.Auth.Validators
{
    public class ResetPasswordValidate : AbstractValidator<ResetPasswordCommand>
    {
        public ResetPasswordValidate()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không đúng định dạng");

            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("Token không được để trống");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("Mật khẩu không được để trống")
                .MinimumLength(8).WithMessage("Mật khẩu phải có ít nhất 8 ký tự")
                .Matches("[A-Z]").WithMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa")
                .Matches("[a-z]").WithMessage("Mật khẩu phải chứa ít nhất 1 chữ thường")
                .Matches("[0-9]").WithMessage("Mật khẩu phải chứa ít nhất 1 chữ số");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Xác nhận mật khẩu không được để trống")
                .Equal(x => x.NewPassword).WithMessage("Xác nhận mật khẩu không khớp");
        }
    }
}
