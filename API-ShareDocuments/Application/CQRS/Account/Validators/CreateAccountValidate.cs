using Application.CQRS.Account.Commands.CreateAccount;
using FluentValidation;

namespace Application.CQRS.Account.Validators
{
    public class CreateAccountValidate : AbstractValidator<CreateAccountCommand>
    {
        public CreateAccountValidate()
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống")
                .MaximumLength(50).WithMessage("Tên đăng nhập tối đa 50 ký tự");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không đúng định dạng");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Họ tên không được để trống")
                .MaximumLength(100).WithMessage("Họ tên tối đa 100 ký tự");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Mật khẩu mới không được để trống")
                .MinimumLength(8).WithMessage("Mật khẩu mới phải có ít nhất 8 ký tự")
                .Matches("[A-Z]").WithMessage("Mật khẩu mới phải có ít nhất 1 chữ hoa")
                .Matches("[0-9]").WithMessage("Mật khẩu mới phải có ít nhất 1 chữ số")
                .Matches("[^a-zA-Z0-9]").WithMessage("Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt");

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\d{9,11}$").When(x => !string.IsNullOrEmpty(x.PhoneNumber))
                .WithMessage("Số điện thoại không hợp lệ");
        }
    }
}
