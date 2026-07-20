using Application.CQRS.Tags.Commands.CreateTag;
using FluentValidation;

namespace Application.CQRS.Tags.Validators
{
    public class CreateTagValidator : AbstractValidator<CreateTagCommand>
    {
        public CreateTagValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên tag không được để trống")
                .MaximumLength(50).WithMessage("Tên tag không vượt quá 50 ký tự");
        }
    }
}
