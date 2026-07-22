using Application.CQRS.DocumentGroups.Commands.UpdateGroup;
using FluentValidation;

namespace Application.CQRS.DocumentGroups.Validators
{
    public class UpdateGroupValidate : AbstractValidator<UpdateGroupCommand>
    {
        public UpdateGroupValidate()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã nhóm chủ đề không hợp lệ");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề nhóm chủ đề không được để trống")
                .MaximumLength(255).WithMessage("Tiêu đề không được vượt quá 255 ký tự");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự");
        }
    }
}
