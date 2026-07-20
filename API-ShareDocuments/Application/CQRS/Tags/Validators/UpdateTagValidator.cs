using Application.CQRS.Tags.Commands.UpdateTag;
using FluentValidation;

namespace Application.CQRS.Tags.Validators
{
    public class UpdateTagValidator : AbstractValidator<UpdateTagCommand>
    {
        public UpdateTagValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã thẻ phân loại không hợp lệ");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên tag không được để trống")
                .MaximumLength(50).WithMessage("Tên tag không vượt quá 50 ký tự");
        }
    }
}
