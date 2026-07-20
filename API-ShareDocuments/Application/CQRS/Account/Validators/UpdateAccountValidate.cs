using Application.CQRS.Account.Commands.UpdateAccount;
using FluentValidation;

namespace Application.CQRS.Account.Validators
{
    public class UpdateAccountValidator : AbstractValidator<UpdateAccountCommand>
    {
        public UpdateAccountValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã tài khoản không hợp lệ");

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống")
                .MaximumLength(50).WithMessage("Tên đăng nhập tối đa 50 ký tự");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không đúng định dạng");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Họ tên không được để trống")
                .MaximumLength(100).WithMessage("Họ tên tối đa 100 ký tự");

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\d{9,11}$").When(x => !string.IsNullOrEmpty(x.PhoneNumber))
                .WithMessage("Số điện thoại không hợp lệ");
        }
    }
}
