using Application.CQRS.Auth.Commands.ForgotPassword;
using FluentValidation;

namespace Application.CQRS.Auth.Validators
{
    public class ForgotPasswordValidate : AbstractValidator<ForgotPasswordCommand>
    {
        public ForgotPasswordValidate()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không đúng định dạng");
        }
    }
}
