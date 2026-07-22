using Application.CQRS.DocumentGroups.Commands.CreateGroup;
using FluentValidation;

namespace Application.CQRS.DocumentGroups.Validators
{
    public class CreateGroupValidate : AbstractValidator<CreateGroupCommand>
    {
        public CreateGroupValidate()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề nhóm chủ đề không được để trống")
                .MaximumLength(200).WithMessage("Tiêu đề không được vượt quá 200 ký tự");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự");
        }
    }
}
